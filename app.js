var express = require('express');
var app = express();
var router = express.Router();

var captureTime = require('./captureTime');
captureTime(app); 

app.use(function prkApp2(req, res, next) {
	next();
});

app.use(router);


router.use(function prkRouter(req, res, next) {
	console.log('ok');
	console.log('okend');
	next();
});

router.use(function prkRouter1(req, res, next) {
	console.log('ok1');
	var a = "";
	for(var i = 0; i< 100; i++) {
		a = a + i;
	}
	console.log('end1');
	next();
});
router.get('/test', function(req, res, next) {
	res.send('test');
});
app.listen(3000);
