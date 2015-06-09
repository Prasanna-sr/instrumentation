## Instrumentation 


[![Build Status](https://travis-ci.org/Prasanna-sr/instrumentation.svg?branch=master)](https://travis-ci.org/Prasanna-sr/instrumentation)
[![Dependencies](https://david-dm.org/Prasanna-sr/instrumentation.svg)](https://david-dm.org/Prasanna-sr/instrumentation)
[![Coverage Status](https://coveralls.io/repos/Prasanna-sr/instrumentation/badge.svg?branch=master)](https://coveralls.io/r/Prasanna-sr/instrumentation?branch=master)

Provides instrumentation for [express](http://expressjs.com/) or connect middleware specific node.js applications.
It helps to capture time taken for each middleware and routes.

## Why
If you run node.js application in production and wonder why certain request takes too long or why certain request fails. This module could help you to get information regarding running time for each middleware and routes which could help you troubleshoot the problem.


## Install [![npm version](https://badge.fury.io/js/instrumentation.svg)](http://badge.fury.io/js/instrumentation)

	$ npm install Instrumentation

## How to use
Initialize your application by requiring the module and calling the constructor
 with the application object.
The timers are made avaialble through req.timers, which can be grabbed anytime during the request period. req.timers is an array containing response time for all your middelwares and routes.

## Usage
	var express = require('express');
	var app = express();
	var instrumentation = require('instrumentation');
	instrumentation(app);

	app.use(function prkApp(req, res, next) {
		setTimeout(function() {
			next();
		}, 250);
	    
	});
	app.get('/apptest', function(req, res, next) {
	    res.send('apptest');
	    next();
	});
	app.use(function prkApp2(req, res, next) {
	    console.log(req.timers);
	});
	app.listen(3000);

Examples are avaialbe [here](https://github.com/Prasanna-sr/instrumentation/tree/master/examples)

## Tests
	$ npm install
	$ npm test

## License

[The MIT License](http://opensource.org/licenses/MIT)
