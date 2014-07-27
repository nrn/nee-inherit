var test = require('tape')
  , nee = require('nee')
  , EE = require('events').EventEmitter
  , inherit = require('./index')

function newEE (oemit) {
  var ee = nee()

  ee.emit = inherit(ee.emit, oemit)
  ee.create = function () {
    return newEE(ee.emit)
  }

  return ee
}

test('ee', function (t) {
  t.plan(8)

  var ee = newEE()
    , ee1 = ee.create()
    , foo = { foo: 1 }
    , ee2 = ee1.create()

  // Mixin
  copy(ee2, foo)

  t.equal(foo.foo, 1, 'Original properties still intact')

  ee.on('bar', function (a, b) { t.equal(b, 2, 'inherited emit 2')})
  ee1.on('bar', function (a, b) { t.equal(b, 2, 'inherited emit 1')})
  foo.on('bar', function (a) {
    t.equal(this.foo, 1, 'correct handler this')
    t.equal(a, 1, 'inherited emit 0')
  })
     .on('bar', function (a, b) { t.equal(b, 2, 'second emit')})

     .emit('bar', [1, 2])

  var nodeA = new EE()
    , nodeB = new EE()

  nodeB.emit = inherit(nodeB.emit.bind(nodeB), nodeA.emit.bind(nodeA))
  nodeB.on('wow', function (a, b) { t.equal(b, 'b', "works with node's ee 1")})
  nodeA.on('wow', function (a) { t.equal(a, 'a', "works with node's ee 2")})

  nodeB.emit('wow', 'a', 'b')

})

function copy (from, to) {
  Object.keys(from).forEach(function (key) {
    to[key] = from[key]
  })
  return to
}

