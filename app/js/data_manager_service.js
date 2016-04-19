'use strict';

app.service('DataManagerService', ['$http', "$timeout", function ($http, $timeout) {
    
    var urlBase = "http://127.0.0.1:5000";

    var cached_data=null;

    var cache_content=[];  // acts as an identifier/key for each type of data. this way we can get from the cache
                           // the specific data we want, simply by reading the key attached to the data

    // function memorySizeOf(obj) {
    // var bytes = 0;

    // function sizeOf(obj) {
    //     if(obj !== null && obj !== undefined) {
    //         switch(typeof obj) {
    //         case 'number':
    //             bytes += 8;
    //             break;
    //         case 'string':
    //             bytes += obj.length * 2;
    //             break;
    //         case 'boolean':
    //             bytes += 4;
    //             break;
    //         case 'object':
    //             var objClass = Object.prototype.toString.call(obj).slice(8, -1);
    //             if(objClass === 'Object' || objClass === 'Array') {
    //                 for(var key in obj) {
    //                     if(!obj.hasOwnProperty(key)) continue;
    //                     sizeOf(obj[key]);
    //                 }
    //             } else bytes += obj.toString().length * 2;
    //             break;
    //         }
    //     }
    //     return bytes;
    // };

    // function formatByteSize(bytes) {
    //     if(bytes < 1024) return bytes + " bytes";
    //     else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
    //     else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
    //     else return(bytes / 1073741824).toFixed(3) + " GiB";
    // };

    // //return formatByteSize(sizeOf(obj));

    // return sizeOf(obj); // returns size of object in bytes, instead of converting to bigger units
    // };

    this.get = function(endpoint, params) {

        if(cached_data==null || cache_content.indexOf(endpoint + JSON.stringify(params)) == -1) {

            var size = JSON.stringify(cached_data).length*2;

            if (size > 2500000) {  // 2,5 million bytes = max size of 2,5MB

                cached_data=null;
                cache_content = [];

                console.log("cleaned cache request");

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
                    cache_content.push(endpoint + JSON.stringify(params));
                    return cached_data;
                });

            } else {
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
                        cache_content.push(endpoint + JSON.stringify(params));
                        return cached_data;
                    });
                }

        } else {
            return $timeout(function() {
                return cached_data;
            }, 0);
        }
    }
}]);