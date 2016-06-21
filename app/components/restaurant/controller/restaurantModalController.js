fxmenuAdminApp
  .controller('RestaurantModalController', function ($scope, $uibModalInstance, selectedRestaurant, FileUploadService) {
		$scope.selectedRestaurant = selectedRestaurant;

		$scope.ok = function () {
		  	$uibModalInstance.close();
		};

		$scope.cancel = function () {
		  	$uibModalInstance.dismiss();
		};

		$scope.getFile = function () {
			fileReader.readAsDataUrl($scope.file, $scope)
			.then(function(result) {
				$scope.imageSrc = result;
			});
		};

  });