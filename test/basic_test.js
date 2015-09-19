var eventually = require('../index')
var n
var previous

describe('eventually()', function () {
  beforeEach(function () {
    n = 0
  })

  before(function () {
    previous = process._events.uncaughtException
  })

  it('fixes stubborn tests', function () {
    return eventually(function (next) {
      expect(++n).toEqual(5)
      next()
    }, 1000, 0)
  })

  it('works inside loops', function () {
    return eventually(function (next) {
      setTimeout(function () {
        expect(++n).toEqual(5)
        next()
      })
    }, 1000, 0)
  })

  it('catches multiple next()s', function () {
    return eventually(function (next) {
      setTimeout(function () {
        next()
        next()
      })
    }, 1000, 0)
  })

  it('process.uncaughtException is restored', function () {
    expect(process._events.uncaughtException).toEqual(previous)
  })

  // it('uncaughts will still work', function (next) {
  //   setTimeout(function () {
  //     throw new Error('wtf')
  //     next()
  //   })
  // })
})
