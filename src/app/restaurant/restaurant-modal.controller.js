(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantModalController', RestaurantModalController);

  RestaurantModalController.$inject = ['logger', 'dataservice', '$scope', '$uibModalInstance', '$uibModal', 'restaurant', 'fileUploader'];
  /* @ngInject */
  function RestaurantModalController(logger, dataservice, $scope, $uibModalInstance, $uibModal, restaurant, fileUploader) {

    init();

    function init() {
      $scope.restaurant = {
        imageSrc: angular.isUndefined(restaurant.restaurantThumbnail) ? '' : restaurant.restaurantThumbnail.S,
        address: angular.isUndefined(restaurant.restaurantAddress) ? '' : restaurant.restaurantAddress.S,
        contactNum: angular.isUndefined(restaurant.restaurantContactNumber) ? '' : restaurant.restaurantContactNumber.S,
        description: angular.isUndefined(restaurant.restaurantDescription) ? '' : restaurant.restaurantDescription.S,
        style: angular.isUndefined(restaurant.restaurantStyle) ? '' : restaurant.restaurantStyle.S,
        id: angular.isUndefined(restaurant.restaurantId) ? '' : restaurant.restaurantId.S,
        name: angular.isUndefined(restaurant.restaurantName) ? '' : restaurant.restaurantName.S,
      };
      
      if (restaurant.restaurantMenu) {
        var menuItems = [];
        angular.forEach(restaurant.restaurantMenu.L, function (value, key) {
          var dish = {};
          dish.name = angular.isUndefined(value.M.name) ? '' : value.M.name.S;
          dish.price = angular.isUndefined(value.M.price) ? '' : value.M.price.N;
          dish.category = angular.isUndefined(value.M.category) ? '' : value.M.category.S;
          dish.dishThumbnail = angular.isUndefined(value.M.dishThumbnail) ? '' : value.M.dishThumbnail.S;
          menuItems.push(dish);
        });

        $scope.restaurant.menuItems = menuItems;
      } else {
        $scope.restaurant.menuItems = [];
      }
    }
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

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
      dataservice.updateARestaurant($scope.restaurant, $scope.file).then(
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