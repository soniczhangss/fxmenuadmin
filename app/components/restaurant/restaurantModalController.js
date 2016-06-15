fxmenuAdminApp
  .controller('RestaurantModalController', function ($scope, $uibModalInstance, selectedRestaurant) {
    $scope.selectedRestaurant = selectedRestaurant;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  });