# mocha-eventually

Retries a test until it eventually works.

```
eventually(function (next), [timeout], [interval]) -> Promise
```

If it doesn't work within `timeout` milliseconds, it's considered a failure.

If a test fails and `timeout` has not ellapsed yet, it will wait `interval` milliseconds and try again.

Returns a promise, which Mocha will happily consume.

```js
var eventually = require('mocha-eventually')

it('eventually works', function () {
  return eventually(function (next) {
    fs.readFile('output.txt', 'utf-8', function (err, data) {
      if (err) return next(err)
      expect(data).toEqual('hello')
    })
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