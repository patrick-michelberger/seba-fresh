'use strict';

var app = require('../..');
import request from 'supertest';

var newCart;

describe('Cart API:', function() {

  describe('GET /api/carts', function() {
    var carts;

    beforeEach(function(done) {
      request(app)
        .get('/api/carts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          carts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      carts.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/carts', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/carts')
        .send({
          name: 'New Cart',
          info: 'This is the brand new cart!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCart = res.body;
          done();
        });
    });

    it('should respond with the newly created cart', function() {
      newCart.name.should.equal('New Cart');
      newCart.info.should.equal('This is the brand new cart!!!');
    });

  });

  describe('GET /api/carts/:id', function() {
    var cart;

    beforeEach(function(done) {
      request(app)
        .get('/api/carts/' + newCart._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          cart = res.body;
          done();
        });
    });

    afterEach(function() {
      cart = {};
    });

    it('should respond with the requested cart', function() {
      cart.name.should.equal('New Cart');
      cart.info.should.equal('This is the brand new cart!!!');
    });

  });

  describe('PUT /api/carts/:id', function() {
    var updatedCart;

    beforeEach(function(done) {
      request(app)
        .put('/api/carts/' + newCart._id)
        .send({
          name: 'Updated Cart',
          info: 'This is the updated cart!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCart = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCart = {};
    });

    it('should respond with the updated cart', function() {
      updatedCart.name.should.equal('Updated Cart');
      updatedCart.info.should.equal('This is the updated cart!!!');
    });

  });

  describe('DELETE /api/carts/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/carts/' + newCart._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when cart does not exist', function(done) {
      request(app)
        .delete('/api/carts/' + newCart._id)
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
