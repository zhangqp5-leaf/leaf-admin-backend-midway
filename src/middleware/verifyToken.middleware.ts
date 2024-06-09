import { IMiddleware, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';

@Middleware()
export class VerifyTokenMiddleware implements IMiddleware<Context, NextFunction> {

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 获取token
      const token = ctx.headers.authorization.split(' ')[1];

      if (!token) {
        ctx.status = 401;
        ctx.body = { message: 'No token provided' };
        return;
      }

      // 排除不需要验证的路由
      const excludedRoutes = ['/api/admin/base/open/captcha', '/api/admin/base/open/login', /^\/static\/.*/];
      const isExcluded = excludedRoutes.some(route => {
        if (route instanceof RegExp) {
          return route.test(ctx.originalUrl);
        } else {
          return ctx.originalUrl.startsWith(route);
        }
      });
      if (!isExcluded) {
        // 解码
        jwt.verify(token, '1997', (err, decoded) => {
          if (err) {
            ctx.status = 401;
            ctx.body = { message: 'Token verification failed' };
            return;
          }
  
          // 检查token是否快要过期
          const currentTime = Date.now() / 1000;
          const expirationTime = decoded.exp;
          const refreshTokenThreshold = 30 * 60; // 自定义刷新时间阈值（单位：秒）
  
          if (expirationTime - currentTime <= refreshTokenThreshold) {
            console.log({decoded})
            // token快要过期，创建新的token并将其发送到客户端
            const newToken = jwt.sign({
              username: decoded.username,
              role: decoded.role,
            }, '1997', { expiresIn: '1h' }); // 使用相同的密钥进行签名
            ctx.setHeader('Authorization', `${newToken}`);
          }
  
          // 在请求中将解码后的token信息存储起来，以便其他路由或中间件使用
          ctx.user = decoded;
        });
      }
      // 执行下一个中间件，例如控制器逻辑
      await next();
    };
  }
}