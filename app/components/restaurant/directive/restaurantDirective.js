fxmenuAdminApp
	.directive('fxmenuMouseoverChangeColor', MouseoverChangeColor );

fxmenuAdminApp
	.directive('fxmenuRestaurants', RestaurantDirective );

function MouseoverChangeColor() {
	return function($scope, $element){
		$element.bind('mouseover', function() {
			$($element).addClass('gray-color');
		});

		$element.bind('mouseleave', function() {
			$($element).removeClass('gray-color');
		});
	};
}

function RestaurantDirective() {
	return {
		restrict: 'E',
		templateUrl: 'app/components/restaurant/view/restaurantView.html',
		controller: 'RestaurantController',
        controllerAs: 'restaurantCtrl'
	};
}