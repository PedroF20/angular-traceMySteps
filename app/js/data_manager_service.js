'use strict';

app.service('DataManagerService', ['$http', "$timeout", function ($http, $timeout) {
    
    var urlBase = "http://127.0.0.1:5000";

    var cached_data=null;
    
    this.get = function(endpoint, params) {
    
        if(cached_data==null) {

            console.log("cache empty request");
            var request = $http({
                url: urlBase + endpoint,
                params: params,
                method: 'GET',
            }).success(function (data, status, headers, config) {
                console.log(data);
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
            
            return request.then(function(response) {
                cached_data=response.data;
                return cached_data;
            });

        } else {
            return $timeout(function() {
                return cached_data;
            }, 0);
        }
    }
}]);