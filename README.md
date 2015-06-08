##Instrumentation
Provides instrumentation for node.js applications.
It helps to capture time taken for each middleware and routes.

## Install

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


## Tests
	$ npm install
	$ npm test

##License

[The MIT License](http://opensource.org/licenses/MIT)
