(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantCreateController', RestaurantCreateController);

  RestaurantCreateController.$inject = ['logger', '$state', 'dataservice', '$scope', '$uibModal', 'fileUploader'];
  /* @ngInject */
  function RestaurantCreateController(logger, $state, dataservice, $scope, $uibModal, fileUploader) {

    init();

    function init() {console.log('file');
      $scope.restaurant = {
        imageSrc: '',
        address: '',
        contactNum: '',
        description: '',
        style: '',
        name: '',
        menuItems: []
      };
    }

    $scope.getFile = function () {
      fileUploader.readAsDataUrl($scope.file, $scope).then(
        function(result) {
          $scope.imageSrc = result;
        },
        function (error) {
          logger.error(error, error.stack, '图片获取失败');
        }
      );
    };

    $scope.save = function () {
      dataservice.addARestaurant($scope.restaurant, $scope.file).then(
        function (result) {
          $state.go('restaurant-list');
        },
        function (error) {
          logger.error(error, error.stack, '餐厅保存失败');
        }
      );
    };

    $scope.newMenuItem = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        controller: 'RestaurantMenuModalController',
        templateUrl: 'src/app/restaurant/restaurant-menu-modal.html',
        resolve: {
          restaurant: function () {
            return $scope.restaurant;
          }
        }
      });
    };
  }
})();