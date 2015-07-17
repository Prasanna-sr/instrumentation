module.exports = function() {

    var args = Array.prototype.slice.call(arguments);

    return function(req, res, originalArgs) {
        var requestStatus = originalArgs[0];

        // No args -> do nothing, else match code or range
        return (!args.length || args.some(function(range) {
            // One array member means exact status to match
            if (range.length === 1) {
                return requestStatus === range[0];
            } else if (range.length === 2) {
                return requestStatus >= range[0] && requestStatus <= range[1];
            }
        }));
    }

};