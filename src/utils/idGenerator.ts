// src/service/idGeneratorService.ts

import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { Snowflake } from 'nodejs-snowflake';

@Provide()
@Scope(ScopeEnum.Singleton) // 定义为单例
export class IdGeneratorService {
  private snowflake;

  constructor() {
    // 配置workerId和dataCenterId
    this.snowflake = new Snowflake({
      custom_epoch: Date.now(),
    });
  }

  generateId(): string {
    return this.snowflake.getUniqueID().toString();
  }
}