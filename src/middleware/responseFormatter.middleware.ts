import { IMiddleware, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { snakeCaseToCamelCase } from '../utils/index';

@Middleware()
export class ResponseFormatterMiddleware implements IMiddleware<Context, NextFunction> {

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 在控制器处理之前执行的代码（如果有需要的话）

      // 执行下一个中间件，例如控制器逻辑
      await next();

      // 控制器处理之后执行的代码
      if (!ctx.body || ctx.status === 404) {
        // 未找到资源或控制器没有设置body时的处理
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: 'Not Found',
          data: null,
        };
      } else if (ctx.status >= 200 && ctx.status < 300) {
        // 将控制器的输出包装在标准响应结构中
        ctx.body = {
          code: 200, // 或者你可能想要设置为 200 或其他业务代码
          msg: 'success',
          data: snakeCaseToCamelCase(ctx.body),
        };
      } else {
        // 将控制器的输出包装在标准响应结构中
        ctx.body = {
          code: ctx.status, // 或者你可能想要设置为 200 或其他业务代码
          msg: ctx.body,
        };
      }
    };
  }
}