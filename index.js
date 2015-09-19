var now = Date.now || function () { return new Date().getDate() }

try {
  eventually.debug = require('debug')('mocha-eventually')
} catch (e) {
  eventually.debug = function () {}
}

function eventually (fn, timeout, interval) {
  var start = now()
  var iteration = 0
  var waitingFor
  var restored
  var listeners = process._events.uncaughtException

  if (timeout == null) timeout = 2000

  return new Promise(function (ok, fail) {
    // Unhook Mocha's default listener for now
    process.removeAllListeners('uncaughtException')
    process.on('uncaughtException', uncaught)

    function uncaught (err) {
      next(err)
    }

    function restore () {
      if (restored) return
      restored = 1
      process._events.uncaughtException = listeners
    }

    function invoke () {
      eventually.debug(
        'invocation #' + iteration +
        ' (' + (now() - start) + 'ms elapsed)')

      waitingFor = ++iteration
      if (fn.length === 0) {
        try {
          var result = fn()
          if (result.then) {
            result.then(function () {
              next()
            }, function (err) {
              throwFail(err)
            })
          } else {
            next()
          }
        } catch (err) {
          next(err)
        }
      } else {
        try { fn(next) } catch (err) { next(err) }
      }
    }

    function next (err) {
      if (waitingFor !== iteration) {
        restore()
        eventually.multipleDoneError()
        return
      }
      waitingFor = null
      if (err) {
        throwFail(err)
      } else {
        restore()
        ok()
      }
    }

    function throwFail (err) {
      var elapsed = now() - start
      if (elapsed > timeout) {
        restore()
        fail(err)
      } else {
        setTimeout(invoke, interval || 20)
      }
    }

    invoke()
  })
}

eventually.multipleDoneError = function () {
  throw new Error('eventually(): done() called multiple times')
}

module.exports = eventually
