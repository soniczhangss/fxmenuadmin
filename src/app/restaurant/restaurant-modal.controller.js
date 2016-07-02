(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantModalController', RestaurantModalController);

  RestaurantModalController.$inject = ['logger', 'dataservice', '$scope', '$uibModalInstance', '$uibModal', 'randomStringGenerator', 'restaurant', 'fileUploader'];
  /* @ngInject */
  function RestaurantModalController(logger, dataservice, $scope, $uibModalInstance, $uibModal, randomStringGenerator, restaurant, fileUploader) {

    $scope.restaurant = {
      imageSrc: angular.isUndefined(restaurant.restaurantThumbnail) ? '' : restaurant.restaurantThumbnail.S,
      address: angular.isUndefined(restaurant.restaurantAddress) ? '' : restaurant.restaurantAddress.S,
      contactNum: angular.isUndefined(restaurant.restaurantContactNumber) ? '' : restaurant.restaurantContactNumber.S,
      description: angular.isUndefined(restaurant.restaurantDescription) ? '' : restaurant.restaurantDescription.S,
      style: angular.isUndefined(restaurant.restaurantStyle) ? '' : restaurant.restaurantStyle.S,
      id: angular.isUndefined(restaurant.restaurantId) ? '' : restaurant.restaurantId.S,
      name: angular.isUndefined(restaurant.restaurantName) ? '' : restaurant.restaurantName.S,
      menuItems: angular.isUndefined(restaurant.restaurantMenu) ? '' : restaurant.restaurantMenu.L
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $scope.getFile = function () {
      fileUploader.readAsDataUrl($scope.file, $scope).then(
        function(result) {
          console.log(result);
          $scope.restaurant.imageSrc = result;
        },
        function (error) {
          console.log(error, error.stack);
        }
      );
    };

    $scope.save = function () {
      var imageFileName = randomStringGenerator.getRandomString();
      dataservice.updateARestaurant($scope.restaurant, $scope.file, imageFileName).then(
        function (result) {
          console.log(result);
        },
        function (error) {
          console.log(error, error.stack);
        }
      );
      $uibModalInstance.close();
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