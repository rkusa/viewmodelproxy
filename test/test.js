/*global describe, it, beforeEach */

var expect = require('chai').expect
  , ViewModelProxy = require('../')

var viewModel = {
  title: 'viewmodelproxy',
  user: {
    name: 'rkusa',
    emails: [
      { email: 'npm.m@rkusa.st', confirmed: true },
      { email: 'github.m@rkusa.st', confirmed: true }
    ]
  },
  helper: function() {
    return 'successfully called'
  }
}

describe('ViewModelProxy', function() {
  var proxy, accessed = []

  beforeEach(function() {
    accessed = []
  })

  it('should throw when being initialized with non-object', function() {
    expect(function() {
     proxy = new ViewModelProxy()
    }).to.throw('the `target` argument must be an `object`')
  })

  it('should not throw when being initialized with an object', function() {
    expect(function() {
      proxy = new ViewModelProxy(viewModel)
    }).to.not.throw()

    proxy.on('get', function(path) {
      accessed.push(path.join('.'))
    })
  })

  it('should return values accordingly', function() {
    expect(proxy.viewModel.title).to.equal(viewModel.title)
    expect(proxy.viewModel.something).to.equal(undefined)
    expect(accessed).to.eql([
      'title',
      'something'
    ])
  })

  it('should return nested values accordingly', function() {
    expect(proxy.viewModel.user.name).to.equal(viewModel.user.name)
    expect(proxy.viewModel.user.something).to.equal(undefined)
    expect(accessed).to.eql([
      'user.name',
      'user.something'
    ])
  })

  it('should work with arrays', function() {
    proxy.viewModel.user.emails.forEach(function(email) {
      return email.email
    })
    expect(accessed).to.eql([
      'user.emails.length',
      'user.emails.0.email',
      'user.emails.1.email'
    ])
  })

  it('not fire the `get` event for functions', function() {
    expect(proxy.viewModel.helper()).to.equal('successfully called')
    expect(accessed).to.eql([])
  })

  it('should allow setting values on the original object', function() {
    proxy.viewModel.user.name = 'm.rkusa'
    expect(viewModel.user.name).to.equal('m.rkusa')
  })

  it('should return the proxy when getting `$proxy`', function() {
    expect(proxy.viewModel.$proxy).to.equal(proxy)
    expect(proxy.viewModel.user.$proxy).to.equal(proxy)
  })
})