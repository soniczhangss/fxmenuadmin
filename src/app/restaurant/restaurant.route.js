(function() {
  'use strict';

  angular
    .module('app.restaurant')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'restaurant',
        config: {
          url: '/restaurant',
          templateUrl: 'src/app/restaurant/restaurant.html',
          controller: 'RestaurantController',
          title: 'Restaurant',
          settings: {
            nav: 2,
            content: '<i class="fa fa-lock"></i> Restaurant'
          }
        }
      }
    ];
  }
})();