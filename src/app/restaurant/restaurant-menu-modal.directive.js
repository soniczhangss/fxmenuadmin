(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .directive('restaurantMenuModal', restaurantMenuModal);

  function restaurantMenuModal() {
    var directive = {
      restrict: 'E',
      templateUrl: 'src/app/restaurant/restaurant-menu-modal.html'
    };
    return directive;
  }
})();