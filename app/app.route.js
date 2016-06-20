fxmenuAdminApp
  .config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'app/components/restaurant/view/restaurantView.html',
          controller: 'RestaurantController',
          controllerAs: 'restaurantCtrl'
        });
    }
  ]);