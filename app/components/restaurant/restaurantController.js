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