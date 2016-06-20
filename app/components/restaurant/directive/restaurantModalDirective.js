fxmenuAdminApp
	.directive('fxmenuRestaurantModal', RestaurantModalDirective);

fxmenuAdminApp
	.directive('fxmenuRestaurantModalForAddNew', RestaurantModalForAddNewDirective);

fxmenuAdminApp
	.directive('noCacheSrc', NoCacheImage);

function NoCacheImage($window) {
	return {
		priority: 99,
		link: function(scope, element, attrs) {
				attrs.$observe('noCacheSrc', function(noCacheSrc) {
				noCacheSrc += '?' + (new Date()).getTime();
				attrs.$set('src', noCacheSrc);
			});
		}
	}
}

function RestaurantModalDirective() {
	return {
		restrict: 'E',
		templateUrl: 'app/components/restaurant/view/restaurantModalView.html'
	};
}

function RestaurantModalForAddNewDirective() {
	return {
		restrict: 'E',
		templateUrl: 'app/components/restaurant/view/restaurantModalForAddNewView.html'
	};
}