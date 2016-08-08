(function() {
  'use strict';

  angular
    .module('blocks.util')
    .directive('fileSelect', fileSelect);

  function fileSelect() {
    var directive = {
      link: function($scope,el) {
        el.bind("change", function(e) {
          $scope.file = (e.srcElement || e.target).files[0];
          $scope.getFile();
        })
      }
    };

    return directive;
  }
})();
