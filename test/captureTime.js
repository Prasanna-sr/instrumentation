var sinon = require('sinon');
var assert = require('assert');
var request = require('supertest');
var captureTime = require('./../index');

var express = require('express');
var app = express();
captureTime(app);

var router = express.Router();
var appMiddleware = sinon.stub().callsArg(2);
var routerMiddleware = sinon.stub().callsArg(2);
var appRouter = function(req, res, next) {
    res.status(200).send('ok');
    next();
};
var appSpyRouter = sinon.spy(appRouter);

app.use(appMiddleware);
app.use(router);
router.use(routerMiddleware);

app.get('/test', appSpyRouter);

describe('app middleware', function() {
    it('should be called', function(done) {
        request(app).get('/test').expect(200).end(function() {
            assert.ok(appMiddleware.called);
            done();
        });
    });
});
describe('router middleware', function() {
    it('should be called', function(done) {
        request(app).get('/test').expect(200).end(function() {
            assert.ok(routerMiddleware.called);
            done();
        });
    });
});

describe('app route', function() {
    it('should be called', function(done) {
        request(app).get('/test').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            done();
        });
    });
});
