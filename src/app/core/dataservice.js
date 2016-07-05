(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$q', 'uuid', 'logger', 'dbRegion', 'dbAccessKeyId', 'dbSecretAccessKey', 'imgRepository', 'randomStringGenerator'];
  /* @ngInject */
  function dataservice($q, uuid, logger, dbRegion, dbAccessKeyId, dbSecretAccessKey, imgRepository, randomStringGenerator) {
    AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});

    var service = {
      getRestaurants: getRestaurants,
      updateARestaurant: updateARestaurant,
      addARestaurant: addARestaurant,
      getLateOrders: getLateOrders,
      getHistoryOrders: getHistoryOrders
    };

    return service;

    function getHistoryOrders() {
      //
    }

    function getLateOrders() {
      var docClient = new AWS.DynamoDB();

      var params = {
        TableName: 'Order-fxmenu',
        FilterExpression: 'attribute_not_exists(#stat)',
        ExpressionAttributeNames: {'#stat': 'status'}
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
            console.log(result);
          },
          function (error) {
            console.log(error, error.stack);
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
              console.log(result);
            },
            function (error) {
              console.log(error, error.stack);
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
      if (!angular.isUndefined(restaurantImgFile)) {
        var restaurantImgFileName = randomStringGenerator.getRandomString();
        uploadAnImage(restaurantImgFile, restaurantImgFileName).then(
          function (result) {
            console.log(result);
          },
          function (error) {
            console.log(error, error.stack);
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
              console.log(result);
            },
            function (error) {
              console.log(error, error.stack);
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
          restaurantThumbnail: {
            S: restaurant.imageSrc
          },
          restaurantMenu: {
            L: menuItemsJSON
          }
        }
      };
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
