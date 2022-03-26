/**
 * Created by Cooper on 2022/03/26.
 */
import { Context } from 'koa';
import KoaGrpc from '../index';
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
