'use strict';

var app = require('../..');
import request from 'supertest';

var newGroup;

describe('Group API:', function() {

  describe('GET /api/groups', function() {
    var groups;

    beforeEach(function(done) {
      request(app)
        .get('/api/groups')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          groups = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      groups.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/groups', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/groups')
        .send({
          name: 'New Group',
          info: 'This is the brand new group!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newGroup = res.body;
          done();
        });
    });

    it('should respond with the newly created group', function() {
      newGroup.name.should.equal('New Group');
      newGroup.info.should.equal('This is the brand new group!!!');
    });

  });

  describe('GET /api/groups/:id', function() {
    var group;

    beforeEach(function(done) {
      request(app)
        .get('/api/groups/' + newGroup._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          group = res.body;
          done();
        });
    });

    afterEach(function() {
      group = {};
    });

    it('should respond with the requested group', function() {
      group.name.should.equal('New Group');
      group.info.should.equal('This is the brand new group!!!');
    });

  });

  describe('PUT /api/groups/:id', function() {
    var updatedGroup;

    beforeEach(function(done) {
      request(app)
        .put('/api/groups/' + newGroup._id)
        .send({
          name: 'Updated Group',
          info: 'This is the updated group!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedGroup = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGroup = {};
    });

    it('should respond with the updated group', function() {
      updatedGroup.name.should.equal('Updated Group');
      updatedGroup.info.should.equal('This is the updated group!!!');
    });

  });

  describe('DELETE /api/groups/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/groups/' + newGroup._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when group does not exist', function(done) {
      request(app)
        .delete('/api/groups/' + newGroup._id)
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
