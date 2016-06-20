fxmenuAdminApp
	.controller('RestaurantController', ['$scope', 'RestaurantDynamoDBService', '$uibModal', function($scope, RestaurantDynamoDBService, $uibModal) {
		RestaurantDynamoDBService.getAllRestaurants().then(
			function (result) {
				$scope.restaurants = result.Items;
			},
			function (error) {
				console.log(error.statusText);
			}
		);

		$scope.newRestaurant = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				size: 'lg',
				templateUrl: 'restaurantModalForAddNewView.html'
			});
		};

		$scope.open = function (restaurant) {
			var modalInstance = $uibModal.open({
				animation: true,
				size: 'lg',
				controller: 'RestaurantModalController',
				controllerAs: 'RestaurantModalCtrl',
				templateUrl: 'restaurantModalView.html',
				resolve: {
					selectedRestaurant: function () {
						return restaurant;
					}
				}
			});
		};
	}]);