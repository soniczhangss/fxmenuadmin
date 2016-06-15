fxmenuAdminApp
	.controller('RestaurantController', ['$scope', 'RestaurantService', '$uibModal', function($scope, RestaurantService, $uibModal) {
		RestaurantService.getAllRestaurants().then(
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