'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var groupCtrlStub = {
  index: 'groupCtrl.index',
  show: 'groupCtrl.show',
  create: 'groupCtrl.create',
  update: 'groupCtrl.update',
  destroy: 'groupCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var groupIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './group.controller': groupCtrlStub
});

describe('Group API Router:', function() {

  it('should return an express router instance', function() {
    groupIndex.should.equal(routerStub);
  });

  describe('GET /api/groups', function() {

    it('should route to group.controller.index', function() {
      routerStub.get
        .withArgs('/', 'groupCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/groups/:id', function() {

    it('should route to group.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'groupCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/groups', function() {

    it('should route to group.controller.create', function() {
      routerStub.post
        .withArgs('/', 'groupCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/groups/:id', function() {

    it('should route to group.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'groupCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/groups/:id', function() {

    it('should route to group.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'groupCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/groups/:id', function() {

    it('should route to group.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'groupCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
