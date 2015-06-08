
##Instrumentation [![Build Status](https://travis-ci.org/Prasanna-sr/instrumentation.svg?branch=master)](https://travis-ci.org/Prasanna-sr/instrumentation)
[![Dependencies](https://david-dm.org/Prasanna-sr/instrumentation.svg)](https://david-dm.org/Prasanna-sr/instrumentation)
[![Coverage Status](https://coveralls.io/repos/Prasanna-sr/instrumentation/badge.svg?branch=master)](https://coveralls.io/r/Prasanna-sr/instrumentation?branch=master)
Provides instrumentation for node.js applications.
It helps to capture time taken for each middleware and routes.


## Install [![npm version](https://badge.fury.io/js/instrumentation.svg)](http://badge.fury.io/js/instrumentation)

	$ npm install Instrumentation

##How to use
Initialize your application by requiring the module and calling the constructor
 with the application object.
The timers are made avaialble through req.timers. req.timers can be grabbed anywhere and anytime during the request.

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

## Tests
	$ npm install
	$ npm test

##License

[The MIT License](http://opensource.org/licenses/MIT)
