'use strict';

var app = require('../..');
import request from 'supertest';

var newDatafeed;

describe('Datafeed API:', function() {

  describe('GET /y', function() {
    var datafeeds;

    beforeEach(function(done) {
      request(app)
        .get('/y')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          datafeeds = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      datafeeds.should.be.instanceOf(Array);
    });

  });

  describe('POST /y', function() {
    beforeEach(function(done) {
      request(app)
        .post('/y')
        .send({
          name: 'New Datafeed',
          info: 'This is the brand new datafeed!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDatafeed = res.body;
          done();
        });
    });

    it('should respond with the newly created datafeed', function() {
      newDatafeed.name.should.equal('New Datafeed');
      newDatafeed.info.should.equal('This is the brand new datafeed!!!');
    });

  });

  describe('GET /y/:id', function() {
    var datafeed;

    beforeEach(function(done) {
      request(app)
        .get('/y/' + newDatafeed._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          datafeed = res.body;
          done();
        });
    });

    afterEach(function() {
      datafeed = {};
    });

    it('should respond with the requested datafeed', function() {
      datafeed.name.should.equal('New Datafeed');
      datafeed.info.should.equal('This is the brand new datafeed!!!');
    });

  });

  describe('PUT /y/:id', function() {
    var updatedDatafeed;

    beforeEach(function(done) {
      request(app)
        .put('/y/' + newDatafeed._id)
        .send({
          name: 'Updated Datafeed',
          info: 'This is the updated datafeed!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedDatafeed = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDatafeed = {};
    });

    it('should respond with the updated datafeed', function() {
      updatedDatafeed.name.should.equal('Updated Datafeed');
      updatedDatafeed.info.should.equal('This is the updated datafeed!!!');
    });

  });

  describe('DELETE /y/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/y/' + newDatafeed._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when datafeed does not exist', function(done) {
      request(app)
        .delete('/y/' + newDatafeed._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
