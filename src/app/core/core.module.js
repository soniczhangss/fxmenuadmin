(function() {
  'use strict';

  angular
    .module('app.core', [
    	'blocks.logger',
    	'ui.router',
    	'ngSanitize',
    	'blocks.router',
    	'ngplus',
    	'ngAnimate',
    	'toastr',
        'blocks.utilities',
    	'ui.bootstrap']);
})();