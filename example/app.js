var express = require('express');
var app = express();
var router = express.Router();

var captureTime = require('./../index.js');
captureTime(app);

app.use(function prkApp1(req, res, next) {
    next();
});

app.get('/apptest', function(req, res, next) {
    res.send('apptest');
    next();
});

app.use(function(err, req, res, next) {
    console.log('ookkk err');
    console.log(err);
    console.log(req.timers);
});


app.use(router);


app.use(function timerssss(req, res, next) {
    console.log('ookkk');
    console.log(req.timers);
    next();
});


router.use(function prkRouter1(req, res, next) {
    setTimeout(function() {
        next();
    }, 200);

});

router.use(function prkRouter2(req, res, next) {
    var a = '';
    for (var i = 0; i < 100; i++) {
        a = a + i;
    }
    wht();
    next();
});
router.get('/test', function test(req, res, next) {
    setTimeout(function() {
        res.send('test');
        next();
    }, 111);

});

router.use(function ee(err, req, res, next) {
    
    console.log('router error');
    console.log(req.timers);
});
app.listen(3000);
