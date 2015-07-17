//Express 4.X example
var express = require('express');
var app = express();
var router = express.Router();

var instrumentation = require('./../index.js');


instrumentation(app, {
    responseTime: instrumentation.httpResponseTime(500),
    treeId: ruleTreeId,
}, function(req, res) {
    //log data here
    logData(req, res);
});


function ruleTreeId(req, res) {
    var params = req.url.split('?');
    var flag = 0;
    // console.log(params);
    params.forEach(function(item) {
        if (item.indexOf('=') !== -1) {
            var query = item.split('=');
            if (query[0].indexOf('treeid') !== -1) {
                if (Number(query[1]) < 1) {
                    flag = 1;
                }
            }
        }

    });
    if (flag === 1) {
        return true;
    }

    //return true;
}

function logData(req, res) {
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
        middlewarePrivateFunction(req);
        next();
    }, 111);

});
app.use(router);

router.use(function prkRouter1(req, res, next) {
    setTimeout(function() {
        next();
    }, 200);

});


function middlewarePrivateFunction(req, cb) {
    req.timers.start('mdPrivateFunction');
    req.timers.stop();
}

function privateFunction(req, cb) {
    req.timers.start('privateFunction');
    var t = new Date().getTime();

    for (var i = 0; i < 10000000; i++) {
        var a = i++;
    }
    req.timers.stop();
}


function privateFunction1(req, cb) {
    req.timers.start('privateFunction1');
    req.timers.stop();
}

router.get('/test', function test(req, res, next) {
    privateFunction(req);
    privateFunction1(req);
    res.status(200).send('Test Page');
    next();
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
