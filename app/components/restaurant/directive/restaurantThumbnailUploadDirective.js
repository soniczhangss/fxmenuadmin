fxmenuAdminApp
    .directive('fileModel', ['$parse', '$window', '$uibModal', 'RestaurantS3Service', function ($parse, $window, $uibModal, RestaurantS3Service) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('change', function() {
                    $uibModal.open({
                        animation: true,
                        size: 'sm',
                        templateUrl: 'loadingAnimationModalView.html'
                    });
                    var url = scope.selectedRestaurant.restaurantThumbnail.S;
                    var fileToUpload = element[0].files[0];
                    if (fileToUpload) {
                        var params = {
                            Key: url.substring(url.lastIndexOf('/')+1),
                            ContentType: fileToUpload.type,
                            Body: fileToUpload,
                            ACL: "public-read"
                        };
                        RestaurantS3Service.getRestaurantImgBucket().upload(params, function (err, data) {
                            if (err)
                                alert("File upload failed.");
                            else {
                                $window.location.href = '/';
                            }
                        });
                    }
                });
            }
        };
    }]);