/* global toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('dbRegion', 'us-east-1')
    .constant('dbAccessKeyId', 'AKIAIGF2QNIBZOJ7DZXA')
    .constant('dbSecretAccessKey', '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')
    .constant('imgRepository', 'https://s3.amazonaws.com/fxmenu-admin-restaurant-img/');
})();
