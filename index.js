var expressSendMethods = ['send', 'json', 'jsonp', 'redirect', 'sendStatus', 'render', 'sendfile', 'sendFile', 'status'];
var httpResponseTime = require('./rules/httpResponseTime');
var httpResponseCode = require('./rules/httpResponseCode');

module.exports = instrument;
instrument.httpResponseTime = httpResponseTime;
instrument.httpResponseCode = httpResponseCode;

function instrument(app, rulesObj, notifyCallback) {

    app.use(function(req, res, next) {
        req.timers = function() {};
        req.timers.value = [];
        var startTime = new Date().getTime();
        req.timers.start = function(name) {
            for (var i = req.timers.value.length - 1; i >= 0; i--) {
                var tempObj = req.timers.value[i];
                var key = Object.keys(tempObj)[0];
                var value = tempObj[key];
                if (value === -1) {
                    key = key + ' -> ' + name;
                    var timerObj = {};
                    timerObj[key] = {};
                    timerObj[key]['time'] = new Date().getTime();
                    timerObj[key]['init'] = -1;
                    req.timers.value.push(timerObj);
                    break;
                }
            }
        }

        req.timers.stop = function() {
            for (var i = req.timers.value.length - 1; i >= 0; i--) {
                var tempObj = req.timers.value[i];
                var key = Object.keys(tempObj)[0];
                var value = tempObj[key]['init'];
                if (value === -1) {
                    var timerObj = {};
                    timerObj[key] = new Date().getTime() - req.timers.value[i][key]['time'];
                    req.timers.value[i] = timerObj;
                    break;
                }

            }
        }
        overrideMethods(res, expressSendMethods, responseSend);

        function responseSend(responseFn) {
            return function() {
<<<<<<< HEAD
            var args = Array.prototype.slice.call(arguments);
                req.timers.push({
=======
                req.timers.value.push({
>>>>>>> 33db9da4a7508583c72f4c989663d30487bc0916
                    '$finalTimer': (new Date().getTime() - startTime)
                });
                var keys = Object.keys(rulesObj);
                var shouldNotify = keys.some(function(key) {
                    var fn = rulesObj[key];
                    return fn(req, res, args);
                });
<<<<<<< HEAD

                if(shouldNotify) {
=======
                if (shouldNotify) {
>>>>>>> 33db9da4a7508583c72f4c989663d30487bc0916
                    notifyCallback(req, res);
                }

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
                $obj["timerObj"][$obj.name] = -1;
                $obj.req.timers.value.push($obj["timerObj"]);
                arguments[2] = function() {
                    $obj["timerObj"][$obj.name] = new Date().getTime() - $obj.counter;
                    $obj.req.timers.value.push($obj["timerObj"]);
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
}
