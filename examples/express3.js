//Express 3.X example
var express = require('express');
var app = express();
var router = express.Router();

var captureTime = require('./../index.js');
captureTime(app);

app.use(function middleware1(req, res, next) {
    next();
});
app.use(function middleware2(req, res, next) {
    setTimeout(function() {
        next();
    }, 111);
});
app.get('/apptest', function apptestRoute(req, res, next) {
    res.send('apptest');
    next();
});
app.get('/apptest1', function(req, res, next) {
    res.send('apptest');
    next();
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

//Error handler
app.use(function(err, req, res, next) {
    console.log(req.timers);
    console.log(req.headers);
});



app.listen(3000);
