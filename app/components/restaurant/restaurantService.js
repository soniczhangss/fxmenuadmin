fxmenuAdminApp
	.service('RestaurantDynamoDBService', ["dbRegion", "dbAccessKeyId", "dbSecretAccessKey", "$q", RestaurantDynamoDBService]);

fxmenuAdminApp
	.service('RestaurantS3Service', ["dbRegion", "dbAccessKeyId", "dbSecretAccessKey", RestaurantS3Service]);

function RestaurantDynamoDBService(dbRegion, dbAccessKeyId, dbSecretAccessKey, $q) {
	var deferred           = $q.defer();
	this.getAllRestaurants = function() {
		var params = {
			TableName : 'Restaurant-fxmenu'
		};

		AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});

		var docClient = new AWS.DynamoDB();

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
}

function RestaurantS3Service(dbRegion, dbAccessKeyId, dbSecretAccessKey) {
	this.getRestaurantImgBucket = function() {
		AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});

		return new AWS.S3({params: { Bucket: 'fxmenu-admin-restaurant-img' }});
	};
}