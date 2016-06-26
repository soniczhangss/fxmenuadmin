fxmenuAdminApp
	.service('FileUploadService', ['$q', '$log', FileUploadService])
    .service('RandomStringService', [RandomStringService]);

function FileUploadService($q, $log) {
	var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function(reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

	var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
         
        var reader = getReader(deferred, scope);         
        reader.readAsDataURL(file);
         
        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL  
    };
}

function RandomStringService() {
    this.getRandomString = function () {
        var s = "";
        var x = 20;
        while(s.length < x && x > 0) {
            var r = Math.random();
            s += (r<0.1 ? Math.floor(r*100) : String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
        }
        return s;
    };
}