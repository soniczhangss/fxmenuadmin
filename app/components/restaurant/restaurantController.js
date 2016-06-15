fxmenuAdminApp.controller('RestaurantController', ['$scope', 'getAllRestaurants', function($scope, getAllRestaurants) {
	$scope.restaurants = getAllRestaurants.restaurants;
}]);