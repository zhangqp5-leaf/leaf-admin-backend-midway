import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1709475977097_6776',
  koa: {
    port: 7001,
  },
  view: {
    defaultViewEngine: 'nunjucks',
  },
  typeorm: {
    dataSource: {
      default :{
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'ysn219zqp221',
        database: 'leaf_admin',
        synchronize: true, // 如果在生产环境，应禁用它
        logging: true, // 打印日志，对于调试很有用，但在生产环境可能需要关闭
        entities: [
          '**/entity/*.entity{.ts,.js}'
        ]
      }
    }
  },
} as MidwayConfig;
