(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .directive('restaurantModal', restaurantModal);

  function restaurantModal() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/restaurant/restaurant-modal.html'
    };
    return directive;
  }
})();