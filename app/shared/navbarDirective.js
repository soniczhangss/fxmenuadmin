fxmenuAdminApp
	.directive('fxmenuNavbar', NavbarDirective );

function NavbarDirective() {
	return {
		restrict: 'E',
		templateUrl: 'app/shared/navbarView.html'
	};
}