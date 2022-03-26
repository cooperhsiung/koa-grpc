/**
 * Created by Cooper on 2022/03/26.
 */
import { Context } from 'koa';
import KoaGrpc from '../index';
var { GreeterService } = require('./gen_code/helloworld_grpc_pb');

const app = new KoaGrpc({ service: GreeterService });

// not found
app.use((ctx: Context) => {
  console.log('ctx.request: ', (ctx.request as any).getName());
});

// result -> Error: 12 UNIMPLEMENTED: Not Found

app.listen('0.0.0.0:50051');
console.log('listening on 50051...');
