fxmenuAdminApp
	.service('RestaurantDynamoDBService', ['dbRegion', 'dbAccessKeyId', 'dbSecretAccessKey', '$q', '$filter', RestaurantDynamoDBService]);

fxmenuAdminApp
	.service('RestaurantS3Service', ['dbRegion', 'dbAccessKeyId', 'dbSecretAccessKey', RestaurantS3Service]);

function RestaurantDynamoDBService(dbRegion, dbAccessKeyId, dbSecretAccessKey, $q, $filter) {
	AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});
	var docClient = new AWS.DynamoDB();

	this.getAllRestaurants = function() {
		var params = {
			TableName : 'Restaurant-fxmenu'
		};
		var deferred = $q.defer();

		docClient.scan(params, function(err, data) {
			if (err) {
				deferred.reject(err);
			}	
			else {
				//console.log(data.Items);
				deferred.resolve(data);
			}
		});

		return deferred.promise;
	};

	this.updateARestaurant = function(restaurant) {
		// For now new changes are not detected.
		// We simply replace the restaurant info with the values of the form.
		var menuItemsJSON = angular.fromJson(angular.toJson(restaurant.menuItems));
		var params = {
			TableName: 'Restaurant-fxmenu',
			Key: {
				restaurantId: {
					S: restaurant.id
				}
			},
			UpdateExpression: 'set restaurantAddress = :addr, restaurantContactNumber=:num, restaurantDescription=:desc, restaurantName=:name, restaurantThumbnail=:thum, restaurantMenu=:menu',
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
				':menu': {
					L: menuItemsJSON
				}
			},
			ReturnValues:'UPDATED_NEW'
		};
		var deferred = $q.defer();
		docClient.updateItem(params, function(err, data) {
			if (err) {
				deferred.reject(err);
			}	
			else {
				deferred.resolve(data);
			}
		});

		return deferred.promise;
	};
}

function RestaurantS3Service(dbRegion, dbAccessKeyId, dbSecretAccessKey) {
	this.getRestaurantImgBucket = function() {
		AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});

		return new AWS.S3({params: { Bucket: 'fxmenu-admin-restaurant-img' }});
	};
}