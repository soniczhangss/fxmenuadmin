fxmenuAdminApp
	.directive('fxmenuRestaurants', RestaurantDirective );

function RestaurantDirective() {
	return {
		restrict: 'E',
		templateUrl: 'app/components/restaurant/restaurantView.html',
		controller: 'RestaurantController',
        controllerAs: 'restaurantCtrl'
	};
}