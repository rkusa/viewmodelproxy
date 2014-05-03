// update the Proxy object to follow the latest direct proxies spec
require('harmony-reflect')

var ViewModelProxy = module.exports = function(target) {
  if (typeof target !== 'object') {
    throw new TypeError('the `target` argument must be an `object`')
  }

  this.viewModel = new NestedProxy(this, target)
}

var EventEmitter = require('events').EventEmitter
ViewModelProxy.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: ViewModelProxy, enumerable: false }
})

var NestedProxy = function(root, target, path) {
  this.root = root
  this.path = path || []

  return new Proxy(target, this)
}

NestedProxy.prototype.get = function(target, name) {
  var path = this.path.concat(name)

  if (target[name] === undefined) {
    this.root.emit('get', path)
    return undefined
  }

  if (typeof target[name] === 'function') {
    return target[name]
  }

  if (typeof target[name] === 'object') {
    return new NestedProxy(this.root, target[name], path)
  }

  this.root.emit('get', path)
  return target[name]
}