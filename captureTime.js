module.exports = function(app) {
    overrideMethod(app, 'use', function(appUseFn) {
        return function() {
            var appFn = arguments[0];
            if (typeof appFn === 'function' && typeof appFn.use === 'function') {
                handleRouterMiddleware(appFn);
            } else {
                arguments[0] = function() {
                    console.log('application start time : ' + appFn.name);
                    var nextFn = arguments[2];
                    arguments[2] = function() {
                        console.log('application end time : ' + appFn.name);
                        nextFn.apply(this, arguments);
                    }
                    return appFn.apply(this, arguments);
                }
            }
            return appUseFn.apply(this, arguments);
        }
    });
    overrideMethod(app, 'get', routerHttpMethods);
    overrideMethod(app, 'post', routerHttpMethods);
    overrideMethod(app, 'put', routerHttpMethods);
    overrideMethod(app, 'delete', routerHttpMethods);

    //router is used or sub middleware are used
    function handleRouterMiddleware(router) {
        overrideMethod(router, "use", function(routerUse) {
            return function() {
                var routerFn = arguments[0];
                arguments[0] = function() {
                    console.log('router start time ' + routerFn.name);
                    var nextFn = arguments[2];
                    arguments[2] = function() {
                        console.log('router end time ' + routerFn.name);
                        nextFn.apply(this, arguments);
                    }
                    return routerFn.apply(this, arguments);
                }
                return routerUse.apply(this, arguments);
            }
        });
        overrideMethod(router, 'get', routerHttpMethods);
        overrideMethod(router, 'post', routerHttpMethods);
        overrideMethod(router, 'put', routerHttpMethods);
        overrideMethod(router, 'delete', routerHttpMethods);
    }

    function routerHttpMethods(routerFn) {
        return function() {
            var middlewareFn = arguments[1];
            var route = arguments[0];
            arguments[1] = function() {
                console.log('router::start time' + 
                	(middlewareFn.name || 'route:' + route));

                var nextFn = arguments[2];
                arguments[2] = function() {
                    console.log('router::end time' + 
                    	(middlewareFn.name || 'route:' + route));

                    nextFn.apply(this, arguments);
                }
                middlewareFn.apply(this, arguments);
            }

            return routerFn.apply(this, arguments);
        }
    }

    function overrideMethod(object, methodName, callback) {
        object[methodName] = callback(object[methodName]);
    }
};
