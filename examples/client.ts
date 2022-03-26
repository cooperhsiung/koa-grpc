/**
 * Created by Cooper on 2022/03/26.
 */
var grpc = require('@grpc/grpc-js');
var messages = require('./gen_code/helloworld_pb');
var services = require('./gen_code/helloworld_grpc_pb');

function main() {
  var target = 'localhost:50051';
  var client = new services.GreeterClient(target, grpc.credentials.createInsecure());

  var request = new messages.HelloRequest();
  var user = 'John';
  request.setName(user);
  client.sayHello(request, function (err: Error, response: any) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Greeting:', response.getMessage());
  });
}

main();
