import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import { ResponseFormatterMiddleware } from './middleware/responseFormatter.middleware';
import { VerifyTokenMiddleware } from './middleware/verifyToken.middleware';
import * as view from '@midwayjs/view-nunjucks';
import * as orm from '@midwayjs/typeorm';
import * as redis from '@midwayjs/redis';
import * as upload from '@midwayjs/upload';
import { WeatherErrorFilter } from './filter/weather.filter';

@Configuration({
  imports: [
    koa,
    validate,
    orm,
    redis,
    upload,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    view,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([VerifyTokenMiddleware, ResponseFormatterMiddleware, ReportMiddleware]);
    // add filter
    this.app.useFilter([WeatherErrorFilter]);
  }
}
