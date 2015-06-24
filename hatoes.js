angular.module('spring.hatoes', []).factory('hatoes', ['$http', '$log', 'ngToast', function($http, $log, ngToast) {

    var urlBase = '/api/';
    var rest = {};

    // Find All
    rest.findAll = function(url, para) {
        return $http.get(urlBase + url, {
            params: para
        }).then(function(received) {
            var data = null;
            if (received.data._embedded) {
                data = received.data._embedded[url];
            }
            return {
                links: angular.toJson(received.data._links),
                data: data
            };
        });
    };

    rest.findAllIn = function(object, objectType, para) {        
        return $http.get(object._links.self.href + '/' + objectType, {
            params: para
        }).then(function(received) {                        
            if(received.data._embedded){                
                return received.data._embedded[objectType];
            }else{
                 var myToastMsg = ngToast.danger({
                content: objectType +" list is empty !",
                timeout: 5000,
            });
            }
        });
    };

    rest.findOne = function(url, id, para) {
        return $http.get(urlBase + url + "/" + id, {
            params: para
        }).then(function(received) {
            return received.data;
        });
    };

    // Save
    rest.save = function(url, data) {
        return $http.post(urlBase + url, data).then(function(received) {
            var myToastMsg = ngToast.success({
                content: 'Successfully added.',
                timeout: 5000,
            });
            return received;
        }, function(error) {
            var myToastMsg = ngToast.danger({
                content: error.statusText,
                timeout: 5000,
            });
            return error;
        });
    };

    rest.saveWithList = function(url, data, listType, list) {
        return $http.post(urlBase + url, data).then(function(received) {
            var paraStart = received.data._links.self.href.indexOf("{?");
            var url = null;
            if (paraStart > 0) {
                url = received.data._links.self.href.substring(0, paraStart);
            } else {
                url = received.data._links.self.href;
            }

            $http.patch(url + "/" + listType, list.join('\n'), {
                headers: {
                    'Content-type': 'text/uri-list'
                }
            }).then(function(received2) {
                var myToastMsg = ngToast.success({
                    content: 'Successfully Saved.',
                    timeout: 5000,
                });
                return received2;
            });
        }, function(error) {
            var myToastMsg = ngToast.danger({
                content: error.statusText,
                timeout: 5000,
            });
            return error;
        });
    };

    rest.patch = function(obj) {
        return $http.patch(obj._links.self.href, obj).then(function(received) {
            var myToastMsg = ngToast.info({
                content: 'Successfully updated.',
                timeout: 5000,
            });
            return received;
        });
    };

    rest.patchWithList = function(object, dataType, list) {
        var paraStart = object._links.self.href.indexOf("{?");
        var url = null;
        if (paraStart > 0) {
            url = object._links.self.href.substring(0, paraStart);
        } else {
            url = object._links.self.href;
        }

        return $http.patch(url + '/' + dataType, list.join('\n'), {
            headers: {
                'Content-type': 'text/uri-list'
            }
        }).then(function(received2) {
            var myToastMsg = ngToast.info({
                content: 'Successfully updated.',
                timeout: 5000,
            });
            return received2;
        });
    };

    rest.delete = function(obj) {
        return $http.delete(obj._links.self.href).then(function(received) {
            var myToastMsg = ngToast.danger({
                content: 'Deleted.',
                timeout: 3000,
            });
            return received;
        });
    };

    rest.deleteFromObject = function(obj,dataType,id){
        var url = obj._links.self.href+'/'+dataType+'/'+id;        
        return $http.delete(url).then(function(received){
            var myToastMsg = ngToast.danger({
                content: 'Removed.',
                timeout: 3000,
            });
            return received;
        });
    };

    return rest;
}]);
