function restaurants(dbRegion, dbAccessKeyId, dbSecretAccessKey) {
	this.restaurants = function() {
		var params = {
			TableName : 'Restaurant-fxmenu'
		};

		AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});

		var docClient = new AWS.DynamoDB();

		docClient.scan(params, function(err, data) {
			if (err)
				return false;
			else
				return data.Items;
		});
	}
}

fxmenuAdminApp.service('getAllRestaurants', ["dbRegion", "dbAccessKeyId", "dbSecretAccessKey", restaurants]);