(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantOrderController', RestaurantOrderController);

  RestaurantOrderController.$inject = ['logger', 'dataservice', '$scope', '$uibModal'];
  /* @ngInject */
  function RestaurantOrderController(logger, dataservice, $scope, $uibModal) {
    dataservice.getOrders().then(
      function (result) {
        $scope.orders = result.Items;
      },
      function (error) {
        console.log(error.statusText);
      }
    );

    $scope.open = function (order) {
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        controller: 'RestaurantOrderController',
        templateUrl: 'src/app/restaurant/restaurant-order-modal.html',
        resolve: {
          order: function () {
            return order;
          }
        }
      });
    };
  }
})();