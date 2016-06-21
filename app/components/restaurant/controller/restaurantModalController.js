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

		$scope.ok = function () {
		  	$uibModalInstance.close();
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
		};

	});