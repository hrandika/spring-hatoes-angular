angular.module('spring.hatoes', []).factory('hatoes', ['$http', '$log', 'ngToast',
    function($http, $log, ngToast) {
        var rest = {};
        // Find All
        rest.findAll = function(url, objectType, para) {
            return $http.get(url, {
                params: para
            }).then(function(received) {
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
        rest.findAllIn = function(obj, objectType, objectName, para) {
            var paraStart = obj._links.self.href.indexOf("{?");
            var url = null;
            if (paraStart > 0) {
                url = obj._links.self.href.substring(0, paraStart);
            } else {
                url = obj._links.self.href;
            }
            return $http.get(url + '/' + objectType, {
                params: para
            }).then(function(received) {
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
        rest.findOne = function(url, id, para) {
            return $http.get(url + "/" + id, {
                params: para
            }).then(function(received) {
                return received.data;
            });
        };
        // Save
        rest.save = function(url, data) {
            return $http.post(url, data).then(function(received) {
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
            return $http.post(url, data).then(function(received) {
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
            var paraStart = obj._links.self.href.indexOf("{?");
            var url = null;
            if (paraStart > 0) {
                url = obj._links.self.href.substring(0, paraStart);
            } else {
                url = obj._links.self.href;
            }
            return $http.patch(url, obj).then(function(received) {
                var myToastMsg = ngToast.info({
                    content: 'Successfully updated.',
                    timeout: 5000,
                });
                $log.info(received);
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
            var paraStart = obj._links.self.href.indexOf("{?");
            var url = null;
            if (paraStart > 0) {
                url = obj._links.self.href.substring(0, paraStart);
            } else {
                url = obj._links.self.href;
            }
            return $http.delete(url).then(function(received) {
                var myToastMsg = ngToast.danger({
                    content: 'Deleted.',
                    timeout: 3000,
                });
                return received;
            });
        };
        rest.deleteFromObject = function(obj, dataType, id) {
            var url = obj._links.self.href + '/' + dataType + '/' + id;
            return $http.delete(url).then(function(received) {
                var myToastMsg = ngToast.danger({
                    content: 'Removed.',
                    timeout: 3000,
                });
                return received;
            });
        };
        // Search a Single Object by Given Parameters
        rest.seachForOne = function(url, para, objectType) {
            return $http.get(url, {
                params: para
            }).then(function(received) {                
                if (received.data._embedded) {
                    return received.data._embedded[objectType][0]
                }
            });
        };
        rest.searchOne = function(url, para, dataType, returnDatatype, position) {
            return $http.get(url, {
                params: para
            }).then(function(received) {
                var itemUrl = null;
                if (received.data._embedded) {
                    var dataList = received.data._embedded[dataType];
                    if (dataList[position]) {
                        itemUrl = dataList[position]._links.self.href;
                    } else {}
                } else {
                    if (received.data instanceof Array) {
                        data = received.data;
                    } else {
                        var data = [];
                    }
                }
                return $http.get(itemUrl + "/" + returnDatatype).then(function(received2) {
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
        return rest;
    }
]);