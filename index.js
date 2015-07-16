var expressSendMethods = ['send', 'json', 'jsonp', 'redirect', 'sendStatus', 'render', 'sendfile','sendFile'];

module.exports = function(app, rulesObj, notifyCallback) {

    app.use(function(req, res, next) {
        req.timers = [];
        overrideMethods(res, expressSendMethods, responseSend);

        function responseSend(responseFn) {
            return function() {
                notifyCallback(req, res);
                return responseFn.apply(this, arguments);
            }
        }
        next();
    });

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
        if (middlewareFn && middlewareFn.length === 4) {
            return function(err, req, res, next) {
                return middlewareFn.apply(this, arguments);
            }
        } else {
            return function() {
                var $obj = {};
                $obj["timerObj"] = {};
                $obj.req = arguments[0];
                $obj.counter = new Date().getTime();
                var nextFn = arguments[2];
                if (middlewareFn.name || route) {
                    $obj.name = middlewareFn.name || route;
                } else {
                    $obj.name = 'anonymous';
                }
                arguments[2] = function() {
                    $obj["timerObj"][$obj.name] = new Date().getTime() - $obj.counter;
                    $obj.req.timers.push($obj["timerObj"]);
                    nextFn.apply(this, arguments);
                }
                return middlewareFn.apply(this, arguments);
            }
        }
    }



    function overrideMethods(object, methodsArr, callback) {
        methodsArr.forEach(function(method) {
            object[method] = callback(object[method]);
        });
    }

    function overrideMethod(object, methodName, callback) {
        object[methodName] = callback(object[methodName]);
    }



};
