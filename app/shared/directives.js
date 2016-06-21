fxmenuAdminApp
	.directive('fxmenuNavbar', NavbarDirective )
	.directive('fxmenuLoadingAnimationModal', LoadingAnimationModalDirective)
	.directive("fxmenuFileSelect", FileSelectDirective);

function FileSelectDirective() {
	return {
		link: function($scope,el) {
			el.bind("change", function(e) {
				$scope.file = (e.srcElement || e.target).files[0];
				$scope.getFile();
			})
		}
	}
}

function LoadingAnimationModalDirective() {
	return {
		restrict: 'E',
		templateUrl: 'app/shared/loadingAnimationModalView.html'
	};
}

function NavbarDirective() {
	return {
		restrict: 'E',
		templateUrl: 'app/shared/navbarView.html'
	};
}