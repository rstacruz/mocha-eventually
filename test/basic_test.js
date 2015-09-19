var eventually = require('../index')
var n
var previous

beforeEach(function () {
  n = 0
})

describe('eventually()', function () {
  before(function () {
    previous = process._events.uncaughtException
  })

  it('fixes stubborn tests', function () {
    return eventually(function (next) {
      expect(++n).toEqual(5)
      next()
    }, 1000, 0)
  })

  it('can throw errors', function (next) {
    eventually(function (next) {
      setTimeout(function () { next(1) }, 20)
    }, 200)
    .then(function () {
      next(new Error('not supposed to succeed'))
    }, function (err) {
      next()
    })
  })

  it('works inside callbacks', function () {
    return eventually(function (next) {
      setTimeout(function () {
        expect(++n).toEqual(5)
        next()
      })
    }, 1000, 0)
  })

  it('catches next()', function () {
    return eventually(function (next) {
      setTimeout(function () {
        expect(++n).toEqual(5)
        next()
      })
    }, 1000, 0)
  })
})

describe('promises', function () {
  it('support promises', function () {
    return eventually(function () {
      return new Promise(function (ok, fail) {
        if (++n === 5) ok()
        else fail()
      })
    }, 2000)
  })

  it('can catch failed promises', function () {
    return eventually(function () {
      return new Promise(function (ok, fail) {
        fail()
      })
    }, 500)
    .then(function () {
      throw new Error('not supposed to succeed')
    }, function (err) {
      expect(err === undefined)
    })
  })
})

describe('corner cases', function () {
  it('catches multiple next()s', function (next) {
    var spy = expect.spyOn(eventually, 'multipleDoneError')

    setTimeout(function () {
      expect(spy).toHaveBeenCalled()
      spy.restore()
      next()
    }, 100)

    eventually(function (next) {
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
