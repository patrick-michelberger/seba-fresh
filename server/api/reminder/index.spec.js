'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var reminderCtrlStub = {
  index: 'reminderCtrl.index',
  show: 'reminderCtrl.show',
  create: 'reminderCtrl.create',
  update: 'reminderCtrl.update',
  destroy: 'reminderCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var reminderIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './reminder.controller': reminderCtrlStub
});

describe('Reminder API Router:', function() {

  it('should return an express router instance', function() {
    reminderIndex.should.equal(routerStub);
  });

  describe('GET /api/reminders', function() {

    it('should route to reminder.controller.index', function() {
      routerStub.get
        .withArgs('/', 'reminderCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/reminders/:id', function() {

    it('should route to reminder.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'reminderCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/reminders', function() {

    it('should route to reminder.controller.create', function() {
      routerStub.post
        .withArgs('/', 'reminderCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/reminders/:id', function() {

    it('should route to reminder.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'reminderCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/reminders/:id', function() {

    it('should route to reminder.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'reminderCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/reminders/:id', function() {

    it('should route to reminder.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'reminderCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
