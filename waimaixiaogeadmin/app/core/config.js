(function() {
  	'use strict';

  	var core = angular.module('app.core');
	
	core.config(router);

  	router.$inject = ['$stateProvider', '$urlRouterProvider'];

  	function router($stateProvider, $urlRouterProvider) {
		$stateProvider
		.state('app', {
			url: '/home',
			templateUrl: 'app/layout/home.html'
		})
		.state('app.restaurant-list', {
			url: '/restaurant-list',
			views: {
				'top-nav': {
					templateUrl: 'app/layout/top-nav.html'
				},
				'content': {
					templateUrl: 'app/restaurant/restaurant-list.html',
					controller: 'RestaurantListController'
				}
			}
		})
		.state('app.restaurant-create', {
			url: '/restaurant-create',
			views: {
				'top-nav': {
					templateUrl: 'app/layout/top-nav.html'
				},
				'content': {
					templateUrl: 'app/restaurant/restaurant-create.html',
					controller: 'RestaurantCreateController'
				}
			}
		})
		.state('login', {
			url: '/login',
			templateUrl: 'app/user/login.html',
			controller: 'LoginController'
		});

		$urlRouterProvider.otherwise('/home/restaurant-list');
  	}

  	core.config(imgUploader);

  	imgUploader.$inject = ['flowFactoryProvider'];

  	function imgUploader(flowFactoryProvider) {
  		flowFactoryProvider.defaults = {
	        target: '/upload',
	        permanentErrors:[404, 500, 501]
	    };
  	}

	core.run(userAuth);

	userAuth.$inject = ['$rootScope', '$state', '$cookies', '$http'];

	function userAuth($rootScope, $state, $cookies, $http) {
		$rootScope.globals = angular.fromJson($cookies.get('globals') || {});
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (!$rootScope.globals.currentUser && !$state.is('login')) {
				$state.go('login');
			}
		});
  	}

	core.run(loadingModal);

	loadingModal.$inject = ['$rootScope', '$uibModal'];

	function loadingModal($rootScope, $uibModal) {
		var openModalEvents = ['loading restaurants'];
		var closeModalEvents = ['loading restaurants finished'];

		var modalInstance;

		var openModal = function() {
			modalInstance = $uibModal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				templateUrl: 'app/layout/loading-modal.html'
			});
		};

		var closeModal = function() {
			modalInstance.close();
		};

		angular.forEach(openModalEvents, function(value){
	        $rootScope.$on(value, openModal);
	    });

		angular.forEach(closeModalEvents, function(value){
	        $rootScope.$on(value, closeModal);
	    });
	}
})();