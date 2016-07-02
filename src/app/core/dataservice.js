(function() {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$q', 'logger', 'dbRegion', 'dbAccessKeyId', 'dbSecretAccessKey', 'imgRepository'];
  /* @ngInject */
  function dataservice($q, logger, dbRegion, dbAccessKeyId, dbSecretAccessKey, imgRepository) {
    var service = {
      getRestaurants: getRestaurants,
      updateARestaurant: updateARestaurant
    };

    return service;

    function getRestaurantImgBucket() {
      AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});

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
      AWS.config.update( {region: dbRegion,
                          accessKeyId: dbAccessKeyId,
                          secretAccessKey: dbSecretAccessKey} );

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

    function updateARestaurant(restaurant, restaurantImgFile, restaurantImgFileName) {
      var deferred = $q.defer();
      uploadAnImage(restaurantImgFile, restaurantImgFileName).then(
        function (result) {

          var items = [];
          angular.forEach(restaurant.menuItems, function (value, key) {
            var imageFile = value.thumbnailObj;
            var fileName = value.thumbnailUrl.substring(value.thumbnailUrl.lastIndexOf('/')+1);
            this.uploadAnImage(imageFile, fileName).then(
              function (result) {
                console.log(result);
              },
              function (error) {
                console.log(error, error.stack);
              }
            );

            var tmp = {};
            delete value.thumbnail;
            delete value.thumbnailObj;
            var tmp2 = {};
            tmp2['S'] = value.name;
            value.name = tmp2;

            var tmp2 = {};
            tmp2['N'] = value.price;
            value.price = tmp2;

            var tmp2 = {};
            tmp2['S'] = value.thumbnailUrl;
            value.thumbnailUrl = tmp2;

            tmp['M'] = value;
            value = tmp;
            items.push(value);
          });

          restaurant.menuItems = items;

          var menuItemsJSON = angular.fromJson(angular.toJson(restaurant.menuItems));
          AWS.config.update( {region: dbRegion,
                              accessKeyId: dbAccessKeyId,
                              secretAccessKey: dbSecretAccessKey} );

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
                S: imgRepository + restaurantImgFileName
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

        },
        function (error) {
          console.log(error, error.stack);
        }
      );

      return deferred.promise;

    }
  }
})();
