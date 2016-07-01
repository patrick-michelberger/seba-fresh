'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var datafeedCtrlStub = {
  index: 'datafeedCtrl.index',
  show: 'datafeedCtrl.show',
  create: 'datafeedCtrl.create',
  update: 'datafeedCtrl.update',
  destroy: 'datafeedCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var datafeedIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './datafeed.controller': datafeedCtrlStub
});

describe('Datafeed API Router:', function() {

  it('should return an express router instance', function() {
    datafeedIndex.should.equal(routerStub);
  });

  describe('GET /y', function() {

    it('should route to datafeed.controller.index', function() {
      routerStub.get
        .withArgs('/', 'datafeedCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /y/:id', function() {

    it('should route to datafeed.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'datafeedCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /y', function() {

    it('should route to datafeed.controller.create', function() {
      routerStub.post
        .withArgs('/', 'datafeedCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /y/:id', function() {

    it('should route to datafeed.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'datafeedCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /y/:id', function() {

    it('should route to datafeed.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'datafeedCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /y/:id', function() {

    it('should route to datafeed.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'datafeedCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
