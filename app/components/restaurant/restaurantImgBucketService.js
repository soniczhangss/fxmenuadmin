fxmenuAdminApp
	.service('RestaurantS3Service', ["dbRegion", "dbAccessKeyId", "dbSecretAccessKey", RestaurantS3Service]);

function RestaurantS3Service(dbRegion, dbAccessKeyId, dbSecretAccessKey) {
	this.getRestaurantImgBucket = function() {
		AWS.config.update({region: dbRegion, accessKeyId: dbAccessKeyId, secretAccessKey: dbSecretAccessKey});

		return new AWS.S3({params: { Bucket: 'fxmenu-admin-restaurant-img' }});
	};
}