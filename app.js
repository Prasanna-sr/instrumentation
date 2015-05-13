var express = require('express');
var app = express();
var router = express.Router();

var captureTime = require('./captureTime');
captureTime(app); 

app.use(function prkApp2(req, res, next) {
	next();
});
app.use(router);

app.get('/apptest', function(req, res, next) {
	res.send('apptest');
	next();
});
router.use(function prkRouter(req, res, next) {
	console.log('prkRouter');
	next();
});

router.use(function prkRouter1(req, res, next) {
	console.log('prkRouter1');
	var a = "";
	for(var i = 0; i< 100; i++) {
		a = a + i;
	}
	next();
});
router.get('/test', function(req, res, next) {
	res.send('test');
	next();
});
app.listen(3000);
