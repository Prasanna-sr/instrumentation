//Express 4.X example
var express = require('express');
var app = express();
var router = express.Router();

var instrumentation = require('./../index.js');


instrumentation(app, {
    responseTime: instrumentation.httpResponseTime(500),
    responseCode400s: instrumentation.httpResponseCode([404])
}, function(req, res) {
    //log data here
    logData(req, res);
});

function logData(req, res) {
    console.log('notify callback called !');
    console.log('/***********************************************************/');
    console.log('/********************** REQUEST HEADERS *********************/');
    console.log('/************************************************************/');
    console.log(req.headers);
    console.log('URL route :' + req.originalUrl);
    console.log('\n');
    console.log('/***************************************************************/');
    console.log('/********************* MIDDLEWARE TIMERS ***********************/');
    console.log('/***************************************************************/');
    console.log(req.timers.value);

}

app.use(function prkApp1(req, res, next) {
    next();
});

app.use(function prkApp2(req, res, next) {
    setTimeout(function() {
        next();
    }, 111);

});
app.use(router);

router.use(function prkRouter1(req, res, next) {
    setTimeout(function() {
        // customFn();
        next();
    }, 200);

});

function customFunction(req, cb) {
    req.timers.start('customFunctioN');

    setTimeout(function() {
        req.timers.stop();
        cb();
    }, 500);
}

router.get('/test', function test(req, res, next) {
        customFunction(req, function() {
            res.status(200).send('test dfsd');
        next();    
        });
});

router.get('/test/httpResponse', function test(req, res, next) {
    setTimeout(function() {
        res.status(404).send('404 Page');
        next();
    }, 0);
});


//response time is avaialble in req.timers
// app.use(function timers(req, res, next) {
//     //Logs when any middleware or routes take more than 100 milliseconds
//     var log = 0;
//     req.timers.forEach(function(obj) {
//         for (var key in obj) {
//             if (obj[key] > 100) {
//                 log = 1;
//             }
//         }
//     });
//     if(log) {
//         console.log(req.timers);
//         console.log(req.headers);
//     }
//     next();
// });

// app.use(function(err, req, res, next) {
//     console.log(err);
//     console.log(req.timers);
//     console.log(req.headers);
// });



app.listen(3000);
