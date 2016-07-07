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
        state: 'restaurant-list',
        config: {
          templateUrl: 'src/app/restaurant/restaurant-list.html',
          controller: 'RestaurantController',
          title: '餐厅列表',
          settings: {
            nav: 2,
            content: '餐厅列表'
          }
        }
      },
      {
        state: 'restaurant-add',
        config: {
          templateUrl: 'src/app/restaurant/restaurant-add.html',
          controller: 'RestaurantAddController',
          title: '添加餐厅',
          settings: {
            nav: 2,
            content: '添加餐厅'
          }
        }
      },
      {
        state: 'restaurant-orders',
        config: {
          templateUrl: 'src/app/restaurant/restaurant-orders.html',
          controller: 'RestaurantOrderController',
          title: '实时订单',
          settings: {
            nav: 2,
            content: '实时订单'
          }
        }
      },
      {
        state: 'restaurant-history-orders',
        config: {
          templateUrl: 'src/app/restaurant/restaurant-history-orders.html',
          controller: 'RestaurantHistoryOrderController',
          title: '历史订单',
          settings: {
            nav: 2,
            content: '历史订单'
          }
        }
      }
    ];
  }
})();