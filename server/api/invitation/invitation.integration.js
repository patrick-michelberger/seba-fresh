'use strict';

var app = require('../..');
import request from 'supertest';

var newInvitation;

describe('Invitation API:', function() {

  describe('GET /api/invitations', function() {
    var invitations;

    beforeEach(function(done) {
      request(app)
        .get('/api/invitations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          invitations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      invitations.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/invitations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/invitations')
        .send({
          name: 'New Invitation',
          info: 'This is the brand new invitation!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newInvitation = res.body;
          done();
        });
    });

    it('should respond with the newly created invitation', function() {
      newInvitation.name.should.equal('New Invitation');
      newInvitation.info.should.equal('This is the brand new invitation!!!');
    });

  });

  describe('GET /api/invitations/:id', function() {
    var invitation;

    beforeEach(function(done) {
      request(app)
        .get('/api/invitations/' + newInvitation._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          invitation = res.body;
          done();
        });
    });

    afterEach(function() {
      invitation = {};
    });

    it('should respond with the requested invitation', function() {
      invitation.name.should.equal('New Invitation');
      invitation.info.should.equal('This is the brand new invitation!!!');
    });

  });

  describe('PUT /api/invitations/:id', function() {
    var updatedInvitation;

    beforeEach(function(done) {
      request(app)
        .put('/api/invitations/' + newInvitation._id)
        .send({
          name: 'Updated Invitation',
          info: 'This is the updated invitation!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedInvitation = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedInvitation = {};
    });

    it('should respond with the updated invitation', function() {
      updatedInvitation.name.should.equal('Updated Invitation');
      updatedInvitation.info.should.equal('This is the updated invitation!!!');
    });

  });

  describe('DELETE /api/invitations/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/invitations/' + newInvitation._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when invitation does not exist', function(done) {
      request(app)
        .delete('/api/invitations/' + newInvitation._id)
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
