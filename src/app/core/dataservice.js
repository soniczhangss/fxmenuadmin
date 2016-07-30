(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$q', '$filter', 'uuid', 'logger', 'dbRegion', 'dbAccessKeyId', 'dbSecretAccessKey', 'imgRepository', 'randomStringGenerator'];
  /* @ngInject */
  function dataservice($q, $filter, uuid, logger, dbRegion, dbAccessKeyId, dbSecretAccessKey, imgRepository, randomStringGenerator) {
    AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});

    var service = {
      getRestaurants: getRestaurants,
      updateARestaurant: updateARestaurant,
      addARestaurant: addARestaurant,
      deleteARestaurant: deleteARestaurant,
      getLateOrders: getLateOrders,
      getHistoryOrders: getHistoryOrders,
      updateAnOrder: updateAnOrder,
      closeAnOrder: closeAnOrder
    };

    return service;

    function closeAnOrder(order) {
      var deferred = $q.defer();
      var status = 'processed';

      var d = new Date();
      var n = d.getTime();
      var dateTime = $filter('date')(n, 'dd-MM-yyyy HH:mm:ss Z');

      var params = {
        TableName: 'Order-fxmenu',
        Key: {
          orderId: {
            S: order.orderId.S
          }
        },
        UpdateExpression: 'set customerContactNumber = :ccn, deliveryAddress=:da, orderDateTime=:odt, orderItems=:ois, paymentMethod=:pm, lastProcessedDateTime=:lpdt, orderStatus=:stat',
        ExpressionAttributeValues:{
          ':ccn': {
            S: order.customerContactNumber.S
          },
          ':da': {
            S: order.deliveryAddress.S
          },
          ':odt': {
            S: order.orderDateTime.S
          },
          ':ois': {
            L: order.orderItems.L
          },
          ':pm': {
            S: order.paymentMethod.S
          },
          ':lpdt': {
            S: dateTime
          },
          ':stat': {
            S: status
          }
        },
        ReturnValues:'UPDATED_NEW'
      };
      var docClient = new AWS.DynamoDB();
      docClient.updateItem(params, function(err, data) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }

    function updateAnOrder(order) {
      var deferred = $q.defer();
      var status = '待处理';

      if (!angular.isUndefined(order.status)) {
        if (!angular.isUndefined(order.status.S))
          status = order.status.S;
      }

      var d = new Date();
      var n = d.getTime();
      var dateTime = $filter('date')(n, 'dd-MM-yyyy HH:mm:ss Z');

      var params = {
        TableName: 'Order-fxmenu',
        Key: {
          orderId: {
            S: order.orderId.S
          }
        },
        UpdateExpression: 'set customerContactNumber = :ccn, deliveryAddress=:da, orderDateTime=:odt, orderItems=:ois, paymentMethod=:pm, lastProcessedDateTime=:lpdt, orderStatus=:stat',
        ExpressionAttributeValues:{
          ':ccn': {
            S: order.customerContactNumber.S
          },
          ':da': {
            S: order.deliveryAddress.S
          },
          ':odt': {
            S: order.orderDateTime.S
          },
          ':ois': {
            L: order.orderItems.L
          },
          ':pm': {
            S: order.paymentMethod.S
          },
          ':lpdt': {
            S: dateTime
          },
          ':stat': {
            S: status
          }
        },
        ReturnValues:'UPDATED_NEW'
      };
      var docClient = new AWS.DynamoDB();
      docClient.updateItem(params, function(err, data) {
        if (err) {
          logger.error(err);
          deferred.reject(err);
        } else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }

    function getHistoryOrders() {
      var docClient = new AWS.DynamoDB();

      var params = {
        TableName: 'Order-fxmenu',
        FilterExpression: '#stat = :proc',
        ExpressionAttributeNames: {'#stat': 'orderStatus'},
        ExpressionAttributeValues: {':proc': {S:'processed'}}
      };
      var deferred = $q.defer();

      docClient.scan(params, function(err, data) {
        if (err) {
          deferred.reject(err);
        } 
        else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }

    function getLateOrders() {
      var docClient = new AWS.DynamoDB();

      var params = {
        TableName: 'Order-fxmenu',
        FilterExpression: '#stat <> :proc',
        ExpressionAttributeNames: {'#stat': 'orderStatus'},
        ExpressionAttributeValues: {':proc': {S:'processed'}}
      };
      var deferred = $q.defer();

      docClient.scan(params, function(err, data) {
        if (err) {
          deferred.reject(err);
        } 
        else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }

    function getRestaurantImgBucket() {
      return new AWS.S3({params: { Bucket: 'fxmenu-admin-restaurant-img' }});
    }

    function uploadAnImage(fileToUpload, imageFileName) {
      var params = {
          Key: imageFileName,
          ContentType: fileToUpload.type,
          Body: fileToUpload,
          ACL: "public-read"
      };
      var deferred = $q.defer();
      getRestaurantImgBucket().upload(params, function (err, data) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(data);
        }
      });
      return deferred.promise;
    }

    function deleteARestaurant(restaurant) {
      var docClient = new AWS.DynamoDB();

      var params = {
        TableName : 'Restaurant-fxmenu',
        Key: {
          restaurantId: {
            S: restaurant.id
          }
        }
      };
      var deferred = $q.defer();

      docClient.deleteItem(params, function(err, data) {
        if (err) {
          deferred.reject(err);
        } 
        else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }

    function getRestaurants() {
      var docClient = new AWS.DynamoDB();

      var params = {
        TableName : 'Restaurant-fxmenu'
      };
      var deferred = $q.defer();

      docClient.scan(params, function(err, data) {
        if (err) {
          deferred.reject(err);
        } 
        else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }

    function updateARestaurant(restaurant, restaurantImgFile) {
      var deferred = $q.defer();
      if (!angular.isUndefined(restaurantImgFile)) {
        var restaurantImgFileName = randomStringGenerator.getRandomString();
        uploadAnImage(restaurantImgFile, restaurantImgFileName).then(
          function (result) {
            logger.info('上传餐厅图片成功', result);
          },
          function (error) {
            logger.error(error, error.stack, '上传餐厅图片失败');
          }
        );
        restaurant.imageSrc = imgRepository + restaurantImgFileName;
      }
      var items = [];
      angular.forEach(restaurant.menuItems, function (value, key) {
        
        if (!angular.isUndefined(value.thumbnailObj)) {
          var dishImgFileName = randomStringGenerator.getRandomString();
          uploadAnImage(value.thumbnailObj, dishImgFileName).then(
            function (result) {
              logger.info('上传' + dishImgFileName + '成功', result);
            },
            function (error) {
              logger.error(error, error.stack, '上传' + dishImgFileName + '成功');
            }
          );
          value.dishThumbnail = imgRepository + dishImgFileName;
        }

        var tmp = {};
        delete value.thumbnailObj;

        var tmp2 = {};
        tmp2['S'] = value.name;
        value.name = tmp2;

        var tmp2 = {};
        tmp2['N'] = value.price;
        value.price = tmp2;

        var tmp2 = {};
        tmp2['S'] = value.category;
        value.category = tmp2;

        var tmp2 = {};
        tmp2['S'] = value.dishThumbnail;
        value.dishThumbnail = tmp2;

        tmp['M'] = value;
        value = tmp;
        items.push(value);
      });

      restaurant.menuItems = items;

      var menuItemsJSON = angular.fromJson(angular.toJson(restaurant.menuItems));

      var docClient = new AWS.DynamoDB();
      var params = {
        TableName: 'Restaurant-fxmenu',
        Key: {
          restaurantId: {
            S: restaurant.id
          }
        },
        UpdateExpression: 'set restaurantAddress = :addr, restaurantContactNumber=:num, restaurantDescription=:desc, restaurantName=:name, restaurantThumbnail=:thum, restaurantStyle=:style, restaurantMenu=:menu',
        ExpressionAttributeValues:{
          ':addr': {
            S: restaurant.address
          },
          ':num': {
            S: restaurant.contactNum
          },
          ':desc': {
            S: restaurant.description
          },
          ':name': {
            S: restaurant.name
          },
          ':thum': {
            S: restaurant.imageSrc
          },
          ':style': {
            S: restaurant.style
          },
          ':menu': {
            L: menuItemsJSON
          }
        },
        ReturnValues:'UPDATED_NEW'
      };

      docClient.updateItem(params, function(err, data) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }

    function addARestaurant(restaurant, restaurantImgFile) {
      var deferred = $q.defer();      
      var items = [];
      angular.forEach(restaurant.menuItems, function (value, key) {
        
        if (!angular.isUndefined(value.thumbnailObj)) {
          var dishImgFileName = randomStringGenerator.getRandomString();
          uploadAnImage(value.thumbnailObj, dishImgFileName).then(
            function (result) {
              logger.info('上传' + dishImgFileName + '成功', result);
            },
            function (error) {
              logger.error(error, error.stack, '上传' + dishImgFileName + '成功');
            }
          );
          value.dishThumbnail = imgRepository + dishImgFileName;
        }

        var tmp = {};
        delete value.thumbnailObj;

        var tmp2 = {};
        tmp2['S'] = value.name;
        value.name = tmp2;

        var tmp2 = {};
        tmp2['N'] = value.price;
        value.price = tmp2;

        var tmp2 = {};
        tmp2['S'] = value.category;
        value.category = tmp2;

        var tmp2 = {};
        tmp2['S'] = value.dishThumbnail;
        value.dishThumbnail = tmp2;

        tmp['M'] = value;
        value = tmp;
        items.push(value);
      });

      restaurant.menuItems = items;

      var menuItemsJSON = angular.fromJson(angular.toJson(restaurant.menuItems));

      var docClient = new AWS.DynamoDB();
      var params = {
        TableName: 'Restaurant-fxmenu',
        Item: {
          restaurantId: {
            S: uuid.v4()
          },
          restaurantAddress: {
            S: restaurant.address
          },
          restaurantContactNumber: {
            S: restaurant.contactNum
          },
          restaurantDescription: {
            S: restaurant.description
          },
          restaurantName: {
            S: restaurant.name
          },
          restaurantMenu: {
            L: menuItemsJSON
          }
        }
      };

      if (!angular.isUndefined(restaurantImgFile)) {
        var restaurantImgFileName = randomStringGenerator.getRandomString();
        uploadAnImage(restaurantImgFile, restaurantImgFileName).then(
          function (result) {
            logger.info('上传餐厅图片成功', result);
          },
          function (error) {
            logger.error(error, error.stack, '上传餐厅图片失败');
          }
        );
        params.Item.restaurantThumbnail.S = imgRepository + restaurantImgFileName;
      }
      docClient.putItem(params, function(err, data) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(data);
        }
      });

      return deferred.promise;
    }
  }
})();
