(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantOrderDetailsController', RestaurantOrderDetailsController);

  RestaurantOrderDetailsController.$inject = ['logger', '$state', 'dataservice', 'order', '$scope', '$uibModalInstance'];
  /* @ngInject */
  function RestaurantOrderDetailsController(logger, $state, dataservice, order, $scope, $uibModalInstance) {
    init();

    function init() {
      if (!angular.isUndefined(order.orderItems)) {
        var orderItems = [];
        angular.forEach(order.orderItems.L, function (value, key) {
          var orderItem = {};
          orderItem.name = angular.isUndefined(value.M.name) ? '' : value.M.name.S;
          orderItem.quantity = angular.isUndefined(value.M.quantity) ? '' : value.M.quantity.N;
          orderItem.price = angular.isUndefined(value.M.price) ? '' : value.M.price.N;
          orderItem.description = angular.isUndefined(value.M.description) ? '' : value.M.description.S;
          if (!angular.isUndefined(value.M.restaurant)) {
              orderItem.restaurant = {
              name: value.M.restaurant.M.name.S,
              address: value.M.restaurant.M.address.S,
              restaurantContactNumber: value.M.restaurant.M.restaurantContactNumber.S
            };
          } else {
            orderItem.restaurant = {};
          }
          orderItems.push(orderItem);
        });
        $scope.orderItems = orderItems;
      } else {
        $scope.orderItems = [];
      }
    }

    $scope.await = function () {
      if (angular.isUndefined(order.status)) {
        order.status = {};
        order.status['S'] = $scope.description;
      }
      dataservice.updateAnOrder(order).then(
        function(result) {
          $state.go('restaurant-orders', {}, {reload: true});
          $uibModalInstance.dismiss();
        },
        function (error) {
          console.log(error, error.stack);
        });
    };

    $scope.finish = function() {
      dataservice.closeAnOrder(order).then(
        function(result) {
          $state.go('restaurant-orders', {}, {reload: true});
          $uibModalInstance.dismiss();
        },
        function (error) {
          console.log(error, error.stack);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
  }
})();