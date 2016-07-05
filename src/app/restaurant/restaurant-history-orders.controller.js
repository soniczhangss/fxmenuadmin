(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantHistoryOrderController', RestaurantHistoryOrderController);

  RestaurantHistoryOrderController.$inject = ['logger', 'dataservice', '$scope', '$uibModal'];
  /* @ngInject */
  function RestaurantHistoryOrderController(logger, dataservice, $scope, $uibModal) {
    dataservice.getHistoryOrders().then(
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
        controller: 'RestaurantOrderDetailsController',
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