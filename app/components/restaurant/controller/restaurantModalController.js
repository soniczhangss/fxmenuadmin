fxmenuAdminApp
	.controller('RestaurantModalController', function ($scope, $filter, $uibModalInstance, selectedRestaurant, RestaurantDynamoDBService, FileUploadService) {
		$scope.selectedRestaurant = selectedRestaurant;

		$scope.restaurant = {
			imageSrc: selectedRestaurant.restaurantThumbnail.S,
			address: selectedRestaurant.restaurantAddress.S,
			contactNum: selectedRestaurant.restaurantContactNumber.S,
			description: selectedRestaurant.restaurantDescription.S,
			id: selectedRestaurant.restaurantId.S,
			name: selectedRestaurant.restaurantName.S,
			menuItems: selectedRestaurant.restaurantMenu.L
		};

		$scope.cancel = function () {
		  	$uibModalInstance.dismiss();
		};

		$scope.getFile = function () {
			FileUploadService.readAsDataUrl($scope.file, $scope)
			.then(function(result) {
				$scope.imageSrc = result;
			});
		};

		$scope.save = function () {
			RestaurantDynamoDBService.updateARestaurant($scope.restaurant).then(
				function (result) {
					console.log(result);
				},
				function (error) {
					console.log(error, error.stack);
				}
			);
			$uibModalInstance.close();
		};

	})

	.controller('RestaurantModalForAddNewController', function ($scope, $filter, $uibModalInstance, $uibModal, uuid, RestaurantDynamoDBService, RestaurantS3Service, FileUploadService, RandomStringService) {
		var imageFileName = RandomStringService.getRandomString();
		
		$scope.create = function () {
			// Need to validate fields
			RestaurantS3Service.uploadImage($scope.file, imageFileName).then(
				function (result) {

					var items = [];
					angular.forEach($scope.restaurant.menuItems, function (value, key) {
						var imageFile = value.thumbnailObj;
						var fileName = value.thumbnailUrl.substring(value.thumbnailUrl.lastIndexOf('/')+1);
						RestaurantS3Service.uploadImage(imageFile, fileName).then(
							function (result) {
								console.log(result);
							},
							function (error) {
								console.log(error, error.stack);
							}
						);

						var tmp = {};
						delete value.thumbnail;
						delete value.thumbnailObj;
						var tmp2 = {};
						tmp2['S'] = value.name;
						value.name = tmp2;

						var tmp2 = {};
						tmp2['N'] = value.price;
						value.price = tmp2;

						var tmp2 = {};
						tmp2['S'] = value.thumbnailUrl;
						value.thumbnailUrl = tmp2;

						tmp['M'] = value;
						value = tmp;
						items.push(value);
					});

					$scope.restaurant.menuItems = items;

					RestaurantDynamoDBService.createARestaurant($scope.restaurant).then(
						function (result) {
							console.log(result);
							$uibModalInstance.close();
						},
						function (error) {
							console.log(error, error.stack);
						}
					);

				},
				function (error) {
					console.log(error, error.stack);
				}
			);
		};

		$scope.getFile = function () {
			var id = uuid.v4();
			var imageSrcUrl = 'https://s3.amazonaws.com/fxmenu-admin-restaurant-img/' + imageFileName;

			$scope.restaurant = {
				imageSrc: imageSrcUrl,
				address: '',
				contactNum: '',
				desc: '',
				id: id,
				name: '',
				menuItems: []
			};

			FileUploadService.readAsDataUrl($scope.file, $scope)
			.then(function(result) {
				$scope.imageSrc = result;
			});
		};

		$scope.cancel = function () {
		  	$uibModalInstance.dismiss();
		};

		$scope.newMenuItem = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				size: 'lg',
				controller: 'RestaurantMenuModalController',
				controllerAs: 'RestaurantMenuModalCtrl',
				templateUrl: 'restaurantMenuModalView.html',
				resolve: {
					newRestaurant: function () {
						return $scope.restaurant;
					}
				}
			});
		};
	})

	.controller('RestaurantMenuModalController', function ($scope, $uibModalInstance, newRestaurant, FileUploadService, RandomStringService) {
		var restaurant = newRestaurant;
		var imageFileName = RandomStringService.getRandomString();
		
		$scope.cancel = function () {
		  	$uibModalInstance.dismiss();
		};

		$scope.getFile = function () {

			var imageSrcUrl = 'https://s3.amazonaws.com/fxmenu-admin-restaurant-img/' + imageFileName;
			$scope.dish = {
				name: '',
				price: '',
				thumbnailUrl: imageSrcUrl,
				thumbnail: '',
				thumbnailObj: ''
			};

			FileUploadService.readAsDataUrl($scope.file, $scope)
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
	});