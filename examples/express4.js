//Express 4.X example
var express = require('express');
var app = express();
var router = express.Router();

var captureTime = require('./../index.js');
captureTime(app, {}, function() {
    console.log('ookay dookie');
});

app.use(function prkApp1(req, res, next) {
    next();
});

app.use(function prkApp2(req, res, next) {
    setTimeout(function (){
        next();
    }, 111);
    
});
app.use(router);

router.use(function prkRouter1(req, res, next) {
    setTimeout(function() {
        next();
    }, 200);

});

router.get('/test', function test(req, res, next) {
    setTimeout(function() {
        res.status(200).send('test dfsd');
        next();
    }, 111);

});


//response time is avaialble in req.timers
app.use(function timers(req, res, next) {
    //Logs when any middleware or routes take more than 100 milliseconds
    var log = 0;
    req.timers.forEach(function(obj) {
        for (var key in obj) {
            if (obj[key] > 100) {
                log = 1;
            }
        }
    });
    if(log) {
        console.log(req.timers);
        console.log(req.headers);
    }
    next();
});

app.use(function(err, req, res, next) {
    console.log(err);
    console.log(req.timers);
    console.log(req.headers);
});



app.listen(3000);
