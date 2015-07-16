module.exports = function(milliseconds) {
    return function(req, res) {
        return req.timers.some(function(timer) {
            if (timer.$finalTimer > milliseconds) {
                return true;
            }
        });
    }
};
