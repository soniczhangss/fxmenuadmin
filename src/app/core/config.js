(function() {
  'use strict';

  var core = angular.module('app.core');

  core.config(toastrConfig);

  toastrConfig.$inject = ['toastrConfig'];
  /* @ngInject */
  function toastrConfig(toastrConfig) {
    toastrConfig.timeOut = 4000;
    toastrConfig.positionClass = 'toast-bottom-right';
  }

  var config = {
    appErrorPrefix: '[Wai-Mai-Xiao-Ge-Admin Error] ',
    appTitle: 'Wai-Mai-Xiao-Ge-Admin'
  };

  core.value('config', config);

  core.config(configure);

  configure.$inject = ['$logProvider', 'routerHelperProvider'];
  /* @ngInject */
  function configure($logProvider, routerHelperProvider) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }
    routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });
  }

})();