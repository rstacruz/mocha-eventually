var now = Date.now || function () { return new Date().getDate() }
var debug

try {
  debug = require('debug')('mocha-eventually')
} catch (e) {
  debug = function () {}
}

module.exports = function eventually (fn, timeout, interval) {
  var start = now()
  var iteration = 0
  var waitingFor
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
      process._events.uncaughtException = listeners
    }

    function invoke () {
      debug('invocation #' + iteration)
      waitingFor = ++iteration
      if (fn.length === 0) {
        try { fn(); next() } catch (err) { next(err) }
      } else {
        try { fn(next) } catch (err) { next(err) }
      }
    }

    function next (err) {
      if (waitingFor !== iteration) {
        if (!err) err = new Error('eventually(): done() called multiple times')
        return
      }
      waitingFor = null
      if (err) {
        var elapsed = now() - start
        if (elapsed > timeout) {
          restore()
          fail(err)
        } else {
          setTimeout(invoke, interval || 20)
        }
      } else {
        restore()
        ok()
      }
    }

    invoke()
  })
}
