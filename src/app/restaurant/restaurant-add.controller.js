(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantAddController', RestaurantAddController);

  RestaurantAddController.$inject = ['logger', 'dataservice', '$scope', '$uibModal', 'fileUploader'];
  /* @ngInject */
  function RestaurantAddController(logger, dataservice, $scope, $uibModal, fileUploader) {

    init();

    function init() {
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
          console.log(error, error.stack);
        }
      );
    };

    $scope.save = function () {
      dataservice.addARestaurant($scope.restaurant, $scope.file).then(
        function (result) {
          console.log(result);
        },
        function (error) {
          console.log(error, error.stack);
        }
      );
      // go to state restaurant-list
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