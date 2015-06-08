##Instrumentation
Provides instrumentation for node.js applications.
It helps to capture time taken for each middleware and routes.

## Install

	$ npm install Instrumentation

## Usage
	var express = require('express');
	var app = express();
	var instrumentation = require('instrumentation');
	instrumentation(app);

	app.use(function prkApp(req, res, next) {
	    next();
	});

	app.get('/apptest', function(req, res, next) {
	    res.send('apptest');
	    next();
	});
	app.use(function prkApp2(req, res, next) {
	    console.log(req.timers);
	});


## Tests
	$ npm install
	$ npm test

##License

[The MIT License](http://opensource.org/licenses/MIT)
