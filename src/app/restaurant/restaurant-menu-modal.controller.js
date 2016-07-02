(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .controller('RestaurantMenuModalController', RestaurantMenuModalController);

  RestaurantMenuModalController.$inject = ['logger', 'imgRepository', 'dataservice', '$scope', '$uibModalInstance', 'randomStringGenerator', 'restaurant', 'fileUploader'];
  /* @ngInject */
  function RestaurantMenuModalController(logger, imgRepository, dataservice, $scope, $uibModalInstance, randomStringGenerator, restaurant, fileUploader) {
    var imageFileName = randomStringGenerator.getRandomString();

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $scope.getFile = function () {

      var imageSrcUrl = imgRepository + imageFileName;
      $scope.dish = {
        name: '',
        price: '',
        category: '',
        thumbnailUrl: imageSrcUrl,
        thumbnail: '',
        thumbnailObj: ''
      };

      fileUploader.readAsDataUrl($scope.file, $scope)
      .then(function(result) {
        $scope.imageSrc = result;
      });
    };

    $scope.addADish = function () {
      $scope.dish.thumbnail = $scope.imageSrc;
      $scope.dish.thumbnailObj = $scope.file;
      restaurant.menuItems.push($scope.dish);
      $uibModalInstance.dismiss();
    };
  }
})();