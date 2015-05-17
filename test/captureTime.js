var sinon = require('sinon');
var assert = require('assert');
var request = require('supertest');
var captureTime = require('./../index');

var express = require('express');
var app = express();
captureTime(app);
var middleware = sinon.stub().callsArg(2);

app.use(middleware);

app.get('/', function(req, res, next) {
	res.status(200).send('ok');
	next();
});

describe('app middleware', function() {
	it('should be called', function(done) {
		request(app).get('/').expect(200).end(function() {
			assert.ok(middleware.calledOnce);
			done();
		});
		
	});
});