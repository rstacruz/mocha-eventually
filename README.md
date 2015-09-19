# mocha-eventually

Retries a test until it eventually works.

[![Status](https://travis-ci.org/rstacruz/mocha-eventually.svg?branch=master)](https://travis-ci.org/rstacruz/mocha-eventually "See test builds")

```js
eventually(callback(next()), [timeout], [interval]) -> Promise
```

`callback` is a function. If it's async, it should either consume the `next()` parameter, or return a promise.

If it doesn't work within `timeout` milliseconds, it's considered a failure.

If a test fails and `timeout` has not ellapsed yet, it will wait `interval` milliseconds and try again.

Returns a promise, which Mocha will happily consume.

```js
var eventually = require('mocha-eventually')

it('eventually works', function () {
  return eventually(function (next) {
    assert(Math.random() > 0.9)
  }, 2000)
})
```

<br>

## Thanks

**mocha-eventually** © 2015+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/mocha-eventually/contributors
