(function() {
  'use strict';

  angular
    .module('app.layout')
    .directive('topNav', topNav);

  /* @ngInject */
  function topNav() {
    var directive = {
      restrict: 'E',
      controller: TopbarController,
      controllerAs: 'vm',
      templateUrl: 'src/app/layout/top-nav.html'
    };

    TopbarController.$inject = ['$scope'];

    /* @ngInject */
    function TopbarController($scope) {
      var vm = this;
    }

    return directive;
  }
})();
