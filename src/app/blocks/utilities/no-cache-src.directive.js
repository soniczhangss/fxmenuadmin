(function() {
  'use strict';

  angular
    .module('blocks.utilities')
    .directive('noCacheSrc', noCacheSrc);

  /* @ngInject */
  function noCacheSrc() {
    var directive = {
      priority: 99,
      link: function(scope, element, attrs) {
          attrs.$observe('noCacheSrc', function(noCacheSrc) {
          noCacheSrc += '?' + (new Date()).getTime();
          attrs.$set('src', noCacheSrc);
        });
      }
    };

    return directive;
  }
})();
