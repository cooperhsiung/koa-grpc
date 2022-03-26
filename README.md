# koa-grpc

[![NPM Version][npm-image]][npm-url]
[![Node Version][node-image]][node-url]

The thrift middle of Koa.

## Installation

```bash
npm i koa-grpc -S
```

## Usage

- simple app

```typescript
var UnpkgService = require('./gen-nodejs/UnpkgService');
import { Context } from 'koa';
import KoaThrift from 'koa-grpc';

const app = new KoaThrift({ service: UnpkgService });

// not found
app.use((ctx: Context) => {
  console.log('ctx.request: ', ctx.request);
});

// result -> InvalidOperation TApplicationException: Not Found

app.listen(9090);
console.log('listening on 9090...');
```

- with route

```typescript
var UnpkgService = require('./gen-nodejs/UnpkgService');
const mount = require('koa-mount');
import { Context } from 'koa';
import KoaThrift from 'koa-grpc';

const app = new KoaThrift({ service: UnpkgService });

// with route
app.use(
  mount('/Publish', function (ctx: Context) {
    console.log('ctx.request: ', ctx.request);
    ctx.body = { code: 0, message: 'publish success' };
  })
);

app.listen(9090);
console.log('listening on 9090...');
```

- use middleware

```typescript
var UnpkgService = require('./gen-nodejs/UnpkgService');
const mount = require('koa-mount');
import { Context } from 'koa';
import KoaThrift from 'koa-grpc';

const app = new KoaThrift({ service: UnpkgService });

// use middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log( `process ${ctx.path} request from ${ctx.ip} cost ${Date.now() - start}ms`);
});

// with route
app.use(
  mount('/Publish', async (ctx: Context) => {
    console.log('ctx.request: ', ctx.request);
    await sleep(300);
    ctx.body = { code: 0, message: 'publish success' };
  })
);

app.listen(9090);
console.log('listening on 9090...');

function sleep(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
```

## Examples

examples with client are listed at [examples](https://github.com/cooperhsiung/koa-grpc/tree/master/examples)

## Todo

- [ ] middleware
- [ ] wrap client

## Others

[Thrift Missing Guide](https://diwakergupta.github.io/thrift-missing-guide)

## License

MIT

[npm-image]: https://img.shields.io/npm/v/koa-grpc.svg
[npm-url]: https://www.npmjs.com/package/koa-grpc
[node-image]: https://img.shields.io/badge/node.js-%3E=8-brightgreen.svg
[node-url]: https://nodejs.org/download/
