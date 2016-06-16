fxmenuAdminApp
	.directive('fxmenuRestaurantModal', RestaurantModalDirective);

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
		templateUrl: 'app/components/restaurant/restaurantModalView.html'
	};
}