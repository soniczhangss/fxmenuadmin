fxmenuAdminApp
	.directive('fxmenuLoadingAnimationModal', LoadingAnimationModal);

function LoadingAnimationModal() {
	return {
		restrict: 'E',
		templateUrl: 'app/shared/loadingAnimationModalView.html'
	};
}