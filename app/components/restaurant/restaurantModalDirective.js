fxmenuAdminApp
	.directive('fxmenuRestaurantModal', RestaurantModalDirective );

function RestaurantModalDirective() {
	return {
		restrict: 'E',
		templateUrl: 'app/components/restaurant/restaurantModalView.html'
	};
}