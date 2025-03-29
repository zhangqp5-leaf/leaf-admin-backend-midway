import { MidwayConfig } from '@midwayjs/core';
import { uploadWhiteList } from '@midwayjs/upload';
// import { tmpdir } from 'os';
import { join } from 'path';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1709475977097_6776',
  koa: {
    port: 7001,
  },
  view: {
    defaultViewEngine: 'nunjucks',
  },
  redis: {
    client: {
      port: 6379, // Redis port
      // host: "127.0.0.1", // Redis host
      host: "118.31.168.157", // Redis host
      password: "ysn219zqp221",
      // db: 0,
    },
  },
  typeorm: {
    dataSource: {
      default :{
        type: 'mysql',
        driver: require('mysql2'),
        host: '118.31.168.157',
        port: 3306,
        username: 'root',
        password: 'YSN219@zqp221',
        database: 'leaf_admin',
        synchronize: true, // 如果在生产环境，应禁用它
        logging: true, // 打印日志，对于调试很有用，但在生产环境可能需要关闭
        entities: [
          '**/entity/*.entity{.ts,.js}'
        ]
      }
    }
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '10mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: uploadWhiteList.filter(ext => ext !== '.pdf'),
    // tmpdir: string，上传的文件临时存储路径
    // tmpdir: join('E:/fronted_project/leaf-admin/leaf-admin-backend/public', '/images'),
    tmpdir: join('/root/backend/leaf-admin-backend/public', '/images'),
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 5 * 24 * 60 * 60 * 1000,
    // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
    base64: false,
    // 仅在匹配路径到 /api/upload 的时候去解析 body 中的文件信息
    match: /\/api\/admin\/base\/comm\/upload/,
  },
} as MidwayConfig;
