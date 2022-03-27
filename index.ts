/**
 * Created by Cooper on 2022/03/26.
 */
import { sendUnaryData, ServiceDefinition, UntypedServiceImplementation } from '@grpc/grpc-js';
import Koa, { Context } from 'koa';
import compose from 'koa-compose';

const grpc = require('@grpc/grpc-js');
const context = require('koa/lib/context');

type Options = {
  env?: string;
  keys?: string[];
  proxy?: boolean;
  subdomainOffset?: number;
  proxyIpHeader?: string;
  maxIpsCount?: number;
};

class Application extends Koa {
  service: ServiceDefinition;

  constructor(options: Options & { service: ServiceDefinition }) {
    super(options);
    this.service = options.service;
    this.context = Object.create(context);
  }

  // @ts-ignore
  createContext(call: any, method: any) {
    const context = {
      path: '/' + method,
      originalUrl: '/' + method,
      method: 'GET', // default method
    } as Context;
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this as any;
    context.req = request.req = response.req = { socket: call.call.stream.session.socket } as any;
    context.res = request.res = response.res = { socket: call.call.stream.session.socket } as any;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    // context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  // @ts-ignore
  callback() {
    const fn = compose(this.middleware);
    return Object.keys(this.service).reduce((impl, method) => {
      impl[method] = this.handleRequest(fn, method) as any;
      return impl;
    }, {} as UntypedServiceImplementation);
  }

  handleRequest(fnMiddleware: any, method: string) {
    return async (call: any, callback: sendUnaryData<any>) => {
      const ctx = this.createContext(call, method);
      ctx.request = call.request;
      ctx.socket = (call as any).call.stream.session.socket;
      ctx.ip = ctx.socket.remoteAddress || '';
      ctx.call = call;
      Object.defineProperty(ctx, 'body', {
        set(v: any) {
          this.response = this._body = v;
        },
        get() {
          return this._body;
        },
      });

      try {
        await fnMiddleware(ctx);
        if (ctx.body === undefined) {
          return callback({ code: grpc.status.UNIMPLEMENTED, details: 'Not Found' }, null);
        }
        callback(null, ctx.body);
      } catch (err) {
        callback(err, null);
      }
    };
  }

  // @ts-ignore
  listen(...args: any) {
    const server = new grpc.Server();
    server.addService(this.service, this.callback());
    return server.bindAsync(...args, grpc.ServerCredentials.createInsecure(), () => {
      server.start();
    });
  }
}

export default Application;
