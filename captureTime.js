module.exports = function(app) {
    var oldAppUse = app.use;

    app.use = function() {
        //console.log('start time');
        var oldArgument = arguments[0];
        //console.log(arguments[0].use.toString());
        //console.log(arguments[0].use);
        //router is used or sub middleware are used
        if (typeof arguments[0] === 'function' && typeof arguments[0].use === 'function') {
            var oldRouterUse = arguments[0].use;
            arguments[0].use = function() {
                //console.log('router start');
                var oldRouterUseArgument = arguments[0];
                //console.log(oldRouterUseArgument.toString());
                arguments[0] = function() {
                    console.log('router start time ' + oldRouterUseArgument.name);
                    var oldNext = arguments[2];
                    arguments[2] = function() {
                        console.log('router end time ' + oldRouterUseArgument.name);
                        oldNext.apply(this, arguments);
                    }
                    var routerArgsReturnValue = oldRouterUseArgument.apply(this, arguments);
                    return routerArgsReturnValue;
                }
                return oldRouterUse.apply(this, arguments);
            }
        }

        //app.use arguments
        arguments[0] = function() {
            console.log('application start time : ' + oldArgument.name);
            var oldAppNext = arguments[2];
            arguments[2] = function() {
                console.log('application end time : ' + oldArgument.name);
                oldAppNext.apply(this, arguments);
            }
            var returnValue = oldArgument.apply(this, arguments);

            return returnValue;
        }
        var rtOldAppUse = oldAppUse.apply(this, arguments);
        return rtOldAppUse;
    };
};
