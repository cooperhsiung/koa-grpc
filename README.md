# koa-grpc

[![NPM Version][npm-image]][npm-url]
[![Node Version][node-image]][node-url]

The grpc middle of Koa, foundation for [koa-suit](https://www.npmjs.com/package/koa-suit)

## Installation

```bash
npm i koa-grpc -S
```

## Usage

### simple app

```typescript
import { Context } from 'koa';
import KoaGrpc from 'koa-grpc';
var { GreeterService } = require('./gen_code/helloworld_grpc_pb');

const app = new KoaGrpc({ service: GreeterService });

// not found
app.use((ctx: Context) => {
  console.log('ctx.request: ', (ctx.request as any).getName());
});

// result -> Error: 12 UNIMPLEMENTED: Not Found

app.listen('0.0.0.0:50051');
console.log('listening on 50051...');
```

### with route

```typescript
import { Context } from 'koa';
import KoaGrpc from 'koa-grpc';
const mount = require('koa-mount');

var { GreeterService } = require('./gen_code/helloworld_grpc_pb');
var messages = require('./gen_code/helloworld_pb');

const app = new KoaGrpc({ service: GreeterService });

// with route
app.use(
  mount('/sayHello', function (ctx: Context) {
    console.log('ctx.request: ', (ctx.request as any).getName());

    var reply = new messages.HelloReply();
    reply.setMessage('Hello ' + ctx.call.request.getName());
    ctx.body = reply;
  })
);

app.listen('0.0.0.0:50051');
console.log('listening on 50051...');
```

### use middleware

```typescript
import { Context } from 'koa';
import KoaGrpc from 'koa-grpc';
const mount = require('koa-mount');

var { GreeterService } = require('./gen_code/helloworld_grpc_pb');
var messages = require('./gen_code/helloworld_pb');

const app = new KoaGrpc({ service: GreeterService });

// use middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`process ${ctx.path} request from ${ctx.ip} cost ${Date.now() - start}ms`);
});

// with route
app.use(
  mount('/sayHello', async function (ctx: Context) {
    console.log('ctx.request: ', (ctx.request as any).getName());

    var reply = new messages.HelloReply();
    reply.setMessage('Hello ' + ctx.call.request.getName());

    await sleep(300); // wait sth
    ctx.body = reply;
  })
);

app.listen('0.0.0.0:50051');
console.log('listening on 50051...');

function sleep(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
```

## Generate code

```sh
npm install -g grpc-tools
cd ./examples
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./gen_code --grpc_out=grpc_js:./gen_code helloworld.proto
```

## Examples

examples with client are listed at [examples](https://github.com/cooperhsiung/koa-grpc/tree/master/examples)

## Others

[grpc node.js part quickstart](https://grpc.io/docs/languages/node/quickstart/)

[more node.js examples from official](https://github.com/grpc/grpc/tree/master/examples/node)

## License

MIT

[npm-image]: https://img.shields.io/npm/v/koa-grpc.svg
[npm-url]: https://www.npmjs.com/package/koa-grpc
[node-image]: https://img.shields.io/badge/node.js-%3E=8-brightgreen.svg
[node-url]: https://nodejs.org/download/
