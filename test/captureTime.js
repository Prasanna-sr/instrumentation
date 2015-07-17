var sinon = require('sinon');
var assert = require('assert');
var request = require('supertest');
var captureTime = require('./../index');

var express = require('express');
var app = express();
captureTime(app, {}, function(){});

var router = express.Router();
var appMiddleware = sinon.stub().callsArg(2);
var routerMiddleware = sinon.stub().callsArg(2);
var appRouter = function(req, res, next) {
    res.status(200).send('ok');
    next();
};
var errorHandler = function(err, req, res, next) {
    res.status(500).send();
};
var spyErrorHandler = sinon.spy(errorHandler);
var appSpyRouter = sinon.spy(appRouter);
var flag;
app.use(appMiddleware);
app.use(router);
router.use(routerMiddleware);
router.use(function(req, res, next) {
    next();
});
router.get('/prkTest', appSpyRouter);
router.get('/prkTest1', function (req, res, next) {
    flag = 1;
    res.status(200).send('ok');
    next();
});
router.post('/prkTest', appSpyRouter);
router.put('/prkTest', appSpyRouter);
router.delete('/prkTest', appSpyRouter);
app.get('/test', appSpyRouter);
app.post('/test', appSpyRouter);
app.put('/test', appSpyRouter);
app.delete('/test', appSpyRouter);

app.get('/error', function(req, res, next) {
    omg();
    res.status(200).send('ok');
});
app.use(spyErrorHandler)

describe('app', function() {
    it('middleware should be called', function(done) {
        request(app).get('/test').expect(500).end(function() {
            assert.ok(appMiddleware.called);
            done();
        });
    });
    it('error middleware should be called', function(done) {
        request(app).get('/error').expect(200).end(function() {
            assert.ok(spyErrorHandler.called);
            done();
        });
    });
    it('GET route should be called', function(done) {
        request(app).get('/test').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            appSpyRouter.reset();
            done();
        });
    });
    it('POST route should be called', function(done) {
        request(app).post('/test').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            appSpyRouter.reset();
            done();
        });
    });
    it('PUT route should be called', function(done) {
        request(app).put('/test').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            appSpyRouter.reset();
            done();
        });
    });
    it('DELETE route should be called', function(done) {
        request(app).delete('/test').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            appSpyRouter.reset();
            done();
        });
    });
});



describe('route', function() {
    it('middleware should be called', function(done) {
        request(app).get('/test').expect(200).end(function() {
            assert.ok(routerMiddleware.called);
            done();
        });
    });
    it('GET should be called', function(done) {
        request(app).get('/prkTest').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            appSpyRouter.reset();
            done();
        });
    });
    it('GET without fn name should be called', function(done) {
        request(app).get('/prkTest1').expect(200).end(function() {
            assert.ok(flag);
            appSpyRouter.reset();
            done();
        });
    });
    it('POST should be called', function(done) {
        request(app).post('/prkTest').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            appSpyRouter.reset();
            done();
        });
    });
    it('PUT should be called', function(done) {
        request(app).put('/prkTest').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            appSpyRouter.reset();
            done();
        });
    });
    it('DELETE should be called', function(done) {
        request(app).delete('/prkTest').expect(200).end(function() {
            assert.ok(appSpyRouter.called);
            appSpyRouter.reset();
            done();
        });
    });
});
