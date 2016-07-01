'use strict';

describe('Filter: amount', function () {

  // load the filter's module
  beforeEach(module('sebaFreshApp'));

  // initialize a new instance of the filter before each test
  var amount;
  beforeEach(inject(function ($filter) {
    amount = $filter('amount');
  }));

  it('should return the input prefixed with "amount filter:"', function () {
    var text = 'angularjs';
    expect(amount(text)).toBe('amount filter: ' + text);
  });

});
