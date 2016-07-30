(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantMenuModalController', RestaurantMenuModalController);

  RestaurantMenuModalController.$inject = ['logger', 'imgRepository', 'dataservice', '$scope', '$uibModalInstance', 'randomStringGenerator', 'restaurant', 'fileUploader'];
  /* @ngInject */
  function RestaurantMenuModalController(logger, imgRepository, dataservice, $scope, $uibModalInstance, randomStringGenerator, restaurant, fileUploader) {

    $scope.dish = {
      name: '',
      price: '',
      category: '',
      dishThumbnail: '',
      thumbnailObj: ''
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $scope.getFile = function () {
      fileUploader.readAsDataUrl($scope.file, $scope).then(
        function(result) {
          $scope.dish.dishThumbnail = result;
          $scope.dish.thumbnailObj = $scope.file;
        },
        function (error) {
          logger.error(error, error.stack, '图片获取失败');
        }
      );
    };

    $scope.addADish = function () {
      restaurant.menuItems.push($scope.dish);
      $uibModalInstance.dismiss();
    };
  }
})();