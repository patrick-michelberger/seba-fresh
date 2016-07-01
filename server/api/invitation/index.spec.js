'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var invitationCtrlStub = {
  index: 'invitationCtrl.index',
  show: 'invitationCtrl.show',
  create: 'invitationCtrl.create',
  update: 'invitationCtrl.update',
  destroy: 'invitationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var invitationIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './invitation.controller': invitationCtrlStub
});

describe('Invitation API Router:', function() {

  it('should return an express router instance', function() {
    invitationIndex.should.equal(routerStub);
  });

  describe('GET /api/invitations', function() {

    it('should route to invitation.controller.index', function() {
      routerStub.get
        .withArgs('/', 'invitationCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/invitations/:id', function() {

    it('should route to invitation.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'invitationCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/invitations', function() {

    it('should route to invitation.controller.create', function() {
      routerStub.post
        .withArgs('/', 'invitationCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/invitations/:id', function() {

    it('should route to invitation.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'invitationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/invitations/:id', function() {

    it('should route to invitation.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'invitationCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/invitations/:id', function() {

    it('should route to invitation.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'invitationCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
