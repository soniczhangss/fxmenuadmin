(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantListController', RestaurantListController);

  RestaurantListController.$inject = ['logger', 'dataservice', '$scope', '$uibModal'];
  function RestaurantListController(logger, dataservice, $scope, $uibModal) {

    init();

    function init() {
      $scope.$emit('loading restaurants');
      dataservice.getRestaurants().then(
        function (result) {
          $scope.restaurants = result.Items;
        },
        function (error) {
          logger.error(error.statusText, error.stack, '餐厅获取失败');
        }
      ).finally(function() {
        $scope.$emit('loading restaurants finished');
      });
    }

    $scope.open = function (restaurant) {
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        controller: 'RestaurantModalController',
        templateUrl: 'app/restaurant/restaurant-modal.html',
        resolve: {
          restaurant: function () {
            return restaurant;
          }
        }
      });
    };
  }
})();