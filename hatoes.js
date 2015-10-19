angular.module('spring.hatoes', []).factory('hatoes', ['$http', '$log', '$q', 'ngToast',
    function ($http, $log, $q, ngToast) {
        var rest = {};
        //
        // Find All
        //
        rest.findAll = function (url, objectType, para) {
            return $http.get(url, {
                params: para
            }).then(function (received) {
                var data = null;
                var page = null;
                if (received.data._embedded) {
                    data = received.data._embedded[objectType];
                } else {
                    if (received.data instanceof Array) {
                        data = received.data;
                    } else {
                        var data = [];
                    }
                }
                if (received.data.page) {
                    page = received.data.page;
                }
                return {
                    links: angular.toJson(received.data._links),
                    data: data,
                    page: page
                };
            });
        };
        //
        // Find All in
        //
        rest.findAllIn = function (object, objectType, objectName, para) {
            return $http.get(removeParams(object) + '/' + objectType, {
                params: para
            }).then(function (received) {
                if (received.data._embedded) {
                    return received.data._embedded[objectName];
                } else {
                    var myToastMsg = ngToast.danger({
                        content: objectType + " list is empty !",
                        timeout: 5000,
                    });
                }
            });
        };
        //
        // Find One
        //
        rest.findOne = function (url, id, para) {
            return $http.get(url + "/" + id, {
                params: para
            }).then(function (received) {
                return received.data;
            });
        };
        //
        // Save
        //
        rest.save = function (url, data) {
            return $http.post(url, data).then(function (received) {
                var myToastMsg = ngToast.success({
                    content: 'Successfully added.',
                    timeout: 5000,
                });
                return received;
            }, function (error) {
                var myToastMsg = ngToast.danger({
                    content: error.statusText,
                    timeout: 5000,
                });
                return error;
            });
        };
        //
        // Save List
        //
        rest.saveList = function (url, dataList) {
            var deferred = $q.defer();
            var returnList = [];
            var count = 0;
            for (var i = 0; i < dataList.length; i++) {
                $http.post(url, dataList[i]).success(function (tickerExpired) {
                    returnList.push(tickerExpired._links.self.href);
                    count++;
                    if (count === dataList.length) {
                        var myToastMsg = ngToast.success({
                            content: 'Successfully added.',
                            timeout: 5000,
                        });
                        deferred.resolve(returnList);
                    }
                });
            } // End for
            return deferred.promise;
        };
        //
        //  Save with List
        //
        rest.saveWithList = function (url, data, listType, list) {
            return $http.post(url, data).then(function (received) {
                $http.patch(removeParams(received) + "/" + listType, list.join('\n'), {
                    headers: {
                        'Content-type': 'text/uri-list'
                    }
                }).then(function (received2) {
                    var myToastMsg = ngToast.success({
                        content: 'Successfully Saved.',
                        timeout: 5000,
                    });
                    return received2;
                });
            }, function (error) {
                var myToastMsg = ngToast.danger({
                    content: error.statusText,
                    timeout: 5000,
                });
                return error;
            });
        };
        //
        // Patch
        //
        rest.patch = function (object) {
            return $http.patch(removeParams(object), object).then(function (received) {
                var myToastMsg = ngToast.info({
                    content: 'Successfully updated.',
                    timeout: 5000,
                });
                $log.info(received);
                return received;
            });
        };
        //
        // Patch with list
        //
        rest.patchWithList = function (object, dataType, list) {
            return $http.patch(removeParams(object) + '/' + dataType, list.join('\n'), {
                headers: {
                    'Content-type': 'text/uri-list'
                }
            }).then(function (received2) {
                var myToastMsg = ngToast.info({
                    content: 'Successfully updated.',
                    timeout: 5000,
                });
                return received2;
            });
        };
        //
        //
        //
        rest.putWithList = function (object, dataType, list) {
            return $http.put(removeParams(object) + '/' + dataType, list.join('\n'), {
                headers: {
                    'Content-type': 'text/uri-list'
                }
            }).then(function (received2) {
                var myToastMsg = ngToast.info({
                    content: 'Successfully updated.',
                    timeout: 5000,
                });
                return received2;
            });
        };
        //
        // Delete
        //
        rest.delete = function (object) {
            return $http.delete(removeParams(object)).then(function (received) {
                var myToastMsg = ngToast.danger({
                    content: 'Deleted.',
                    timeout: 3000,
                });
                return received;
            });
        };
        rest.deleteFromObjectURL = function (object, dataType, removingObjectURL) {
            return this.deleteFromObject(object, dataType, getIdFromURL(removingObjectURL));
        };
        //
        // Delete From Object
        //
        rest.deleteFromObject = function (object, dataType, id) {
            var url = removeParams(object) + '/' + dataType + '/' + id;
            return $http.delete(url).then(function (received) {
                var myToastMsg = ngToast.danger({
                    content: 'Removed.',
                    timeout: 3000,
                });
                return received;
            });
        };
        
        //
        // Search a Single Object by Given Parameters
        //
        rest.seachForOne = function (url, para, objectType) {
            return $http.get(url, {
                params: para
            }).then(function (received) {
                if (received.data._embedded) {
                    return received.data._embedded[objectType][0]
                }
            });
        };
        //
        // Search One
        //
        rest.searchOne = function (url, para, dataType, returnDatatype, position) {
            return $http.get(url, {
                params: para
            }).then(function (received) {
                var itemUrl = null;
                if (received.data._embedded) {
                    var dataList = received.data._embedded[dataType];
                    if (dataList[position]) {
                        itemUrl = dataList[position]._links.self.href;
                    } else { }
                } else {
                    if (received.data instanceof Array) {
                        data = received.data;
                    } else {
                        var data = [];
                    }
                }
                return $http.get(itemUrl + "/" + returnDatatype).then(function (received2) {
                    var data = null;
                    var page = null;
                    if (received2.data._embedded) {
                        data = received2.data._embedded[returnDatatype];
                    } else {
                        if (received2.data instanceof Array) {
                            data = received2.data;
                        } else {
                            var data = [];
                        }
                    }
                    if (received2.data.page) {
                        page = received2.data.page;
                    }
                    return {
                        links: angular.toJson(received2.data._links),
                        data: data,
                        page: page
                    };
                });
            });
        };
        //
        // Utils
        //
        var removeParams = function (object) {
            var paraStart = object._links.self.href.indexOf("{?");
            var url = null;
            if (paraStart > 0) {
                url = object._links.self.href.substring(0, paraStart);
            } else {
                url = object._links.self.href;
            }
            return url;
        };
        var getIdFromURL = function (url) {
            var paraStart = url.lastIndexOf("/");
            return url.substring(paraStart + 1);

        };
        // Return Object 
        return rest;
    }
]);