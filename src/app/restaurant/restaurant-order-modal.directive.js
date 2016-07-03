(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .directive('restaurantOrderModal', restaurantOrderModal);

  function restaurantOrderModal() {
    var directive = {
      restrict: 'E',
      templateUrl: 'src/app/restaurant/restaurant-order-modal.html'
    };
    return directive;
  }
})();