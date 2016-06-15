fxmenuAdminApp
	.service('RestaurantService', ["dbRegion", "dbAccessKeyId", "dbSecretAccessKey", "$q", RestaurantService]);

function RestaurantService(dbRegion, dbAccessKeyId, dbSecretAccessKey, $q) {
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