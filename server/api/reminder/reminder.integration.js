'use strict';

var app = require('../..');
import request from 'supertest';

var newReminder;

describe('Reminder API:', function() {

  describe('GET /api/reminders', function() {
    var reminders;

    beforeEach(function(done) {
      request(app)
        .get('/api/reminders')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          reminders = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      reminders.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/reminders', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/reminders')
        .send({
          name: 'New Reminder',
          info: 'This is the brand new reminder!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newReminder = res.body;
          done();
        });
    });

    it('should respond with the newly created reminder', function() {
      newReminder.name.should.equal('New Reminder');
      newReminder.info.should.equal('This is the brand new reminder!!!');
    });

  });

  describe('GET /api/reminders/:id', function() {
    var reminder;

    beforeEach(function(done) {
      request(app)
        .get('/api/reminders/' + newReminder._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          reminder = res.body;
          done();
        });
    });

    afterEach(function() {
      reminder = {};
    });

    it('should respond with the requested reminder', function() {
      reminder.name.should.equal('New Reminder');
      reminder.info.should.equal('This is the brand new reminder!!!');
    });

  });

  describe('PUT /api/reminders/:id', function() {
    var updatedReminder;

    beforeEach(function(done) {
      request(app)
        .put('/api/reminders/' + newReminder._id)
        .send({
          name: 'Updated Reminder',
          info: 'This is the updated reminder!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedReminder = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedReminder = {};
    });

    it('should respond with the updated reminder', function() {
      updatedReminder.name.should.equal('Updated Reminder');
      updatedReminder.info.should.equal('This is the updated reminder!!!');
    });

  });

  describe('DELETE /api/reminders/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/reminders/' + newReminder._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when reminder does not exist', function(done) {
      request(app)
        .delete('/api/reminders/' + newReminder._id)
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
