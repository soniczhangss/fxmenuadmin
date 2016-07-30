(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantOrderController', RestaurantOrderController);

  RestaurantOrderController.$inject = ['logger', 'dataservice', '$scope', '$uibModal'];
  /* @ngInject */
  function RestaurantOrderController(logger, dataservice, $scope, $uibModal) {
    dataservice.getLateOrders().then(
      function (result) {
        $scope.orders = result.Items;
      },
      function (error) {
        logger.error(error.statusText, error.stack, '订单获取失败');
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