(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantController', RestaurantController);

  RestaurantController.$inject = ['logger', 'dataservice', '$scope', '$uibModal'];
  /* @ngInject */
  function RestaurantController(logger, dataservice, $scope, $uibModal) {
    dataservice.getRestaurants().then(
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
        templateUrl: 'src/app/restaurant/restaurant-modal.html',
        resolve: {
          restaurant: function () {
            return restaurant;
          }
        }
      });
    };
  }
})();