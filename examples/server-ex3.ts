/**
 * Created by Cooper on 2022/03/26.
 */
import { Context } from 'koa';
import KoaGrpc from '../index';
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
