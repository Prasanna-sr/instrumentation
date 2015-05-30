module.exports = function(app) {
    overrideMethod(app, 'use', appMiddleware);
    overrideMethod(app, 'get', routerHttpMethods);
    overrideMethod(app, 'post', routerHttpMethods);
    overrideMethod(app, 'put', routerHttpMethods);
    overrideMethod(app, 'delete', routerHttpMethods);

    function appMiddleware(appUseFn) {
        return function() {
            var appFn = arguments[0];
            if (typeof appFn === 'function' && typeof appFn.use === 'function') {
                handleRouterMethods(appFn);
            } else if (typeof appFn === 'function') {
                arguments[0] = middlewareHandler(appFn);
            }
            return appUseFn.apply(this, arguments);
        }
    }

    //router is used or sub middleware are used
    function handleRouterMethods(router) {
        overrideMethod(router, "use", routerMiddleware);
        overrideMethod(router, 'get', routerHttpMethods);
        overrideMethod(router, 'post', routerHttpMethods);
        overrideMethod(router, 'put', routerHttpMethods);
        overrideMethod(router, 'delete', routerHttpMethods);
    }

    function routerMiddleware(routerUse) {
        return function() {
            var routerFn = arguments[0];
            arguments[0] = middlewareHandler(routerFn);
            return routerUse.apply(this, arguments);
        }
    }

    function routerHttpMethods(routerFn) {
        return function() {
            var middlewareFn = arguments[1];
            var route = arguments[0];
            arguments[1] = middlewareHandler(middlewareFn, route);
            return routerFn.apply(this, arguments);
        }
    }

    function middlewareHandler(middlewareFn, route) {
        return function() {
            var $obj = {};
            $obj["timerObj"] = {};
            $obj.req = arguments[0];
            $obj.counter = new Date().getTime();
            if (!arguments[0].timers) {
                arguments[0].timers = [];
            }
            //console.log('router::start time' + (middlewareFn.name || 'route:' + route));
            var nextFn = arguments[2];
            arguments[2] = function() {
            //console.log('router::end time' + (middlewareFn.name || 'route:' + route));

                if (middlewareFn.name) {
                    $obj["timerObj"][middlewareFn.name] = new Date().getTime() - $obj.counter;
                } else {
                    $obj["timerObj"]["anonymous"] = new Date().getTime() - $obj.counter;
                }
                $obj.req.timers.push($obj["timerObj"]);
                nextFn.apply(this, arguments);

            }
            return middlewareFn.apply(this, arguments);
        }
    }

    function overrideMethod(object, methodName, callback) {
        object[methodName] = callback(object[methodName]);
    }
};
