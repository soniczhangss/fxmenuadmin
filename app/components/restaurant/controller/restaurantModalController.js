fxmenuAdminApp
	.controller('RestaurantModalController', function ($scope, $filter, $uibModalInstance, selectedRestaurant, RestaurantDynamoDBService, FileUploadService) {
		$scope.selectedRestaurant = selectedRestaurant;

		$scope.restaurant = {
			imageSrc: selectedRestaurant.restaurantThumbnail.S,
			address: selectedRestaurant.restaurantAddress.S,
			contactNum: selectedRestaurant.restaurantContactNumber.S,
			description: selectedRestaurant.restaurantDescription.S,
			id: selectedRestaurant.restaurantId.S,
			name: selectedRestaurant.restaurantName.S,
			menuItems: selectedRestaurant.restaurantMenu.L
		};

		$scope.cancel = function () {
		  	$uibModalInstance.dismiss();
		};

		$scope.getFile = function () {
			FileUploadService.readAsDataUrl($scope.file, $scope)
			.then(function(result) {
				$scope.imageSrc = result;
			});
		};

		$scope.save = function () {
			RestaurantDynamoDBService.updateARestaurant($scope.restaurant).then(
				function (result) {
					console.log(result);
				},
				function (error) {
					console.log(error, error.stack);
				}
			);
			$uibModalInstance.close();
		};

	})

	.controller('RestaurantModalForAddNewController', function ($scope, $uibModalInstance, uuid, RestaurantDynamoDBService, RestaurantS3Service, FileUploadService) {

		$scope.create = function () {
			// Need to validate fields
			RestaurantS3Service.uploadImage($scope.file, $scope.file);
			RestaurantDynamoDBService.createARestaurant($scope.restaurant).then(
				function (result) {
					console.log(result);
					$uibModalInstance.close();
				},
				function (error) {
					console.log(error, error.stack);
				}
			);
		};

		$scope.getFile = function () {
			var id = uuid.v4();
			var imageSrcUrl = 'https://s3.amazonaws.com/fxmenu-admin-restaurant-img/' + $scope.file.name;

			$scope.restaurant = {
				imageSrc: imageSrcUrl,
				address: '',
				contactNum: '',
				desc: '',
				id: id,
				name: '',
				menuItems: []
			};

			FileUploadService.readAsDataUrl($scope.file, $scope)
			.then(function(result) {
				$scope.imageSrc = result;
			});
		};

		$scope.cancel = function () {
		  	$uibModalInstance.dismiss();
		};
	});