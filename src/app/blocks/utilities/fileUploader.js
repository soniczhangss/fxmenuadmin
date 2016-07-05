(function() {
  'use strict';

  angular
    .module('blocks.utilities')
    .factory('fileUploader', fileUploader);

  fileUploader.$inject = ['$q'];
  /* @ngInject */
  function fileUploader($q) {
    var service = {
        readAsDataUrl: readAsDataURL
    };

    return service;

    function onLoad(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    function onError(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    function onProgress(reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    function getReader(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    function readAsDataURL(file, scope) {
        var deferred = $q.defer();
         
        var reader = getReader(deferred, scope);         
        reader.readAsDataURL(file);
         
        return deferred.promise;
    };
  }
})();