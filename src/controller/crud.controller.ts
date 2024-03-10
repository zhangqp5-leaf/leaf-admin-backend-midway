import { Inject, Controller, Get, Query, Body, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CrudService } from '../service/crud.service';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  CrudService: CrudService;

  // 获取列表
  @Get('/v1/queryUserList')
  async getDemoUserList(@Query() dto) {
    const getDemoUserListRes = await this.CrudService.getDemoUserList(dto);
    return getDemoUserListRes;
  }
  // 添加规则
  @Post('/v1/user')
  async addDemoUser(@Body() dto) {
    try {
      const addDemoUserRes = await this.CrudService.addDemoUser(dto);
      this.ctx.body = addDemoUserRes;
      this.ctx.status = 200;
    } catch (error) {
      this.ctx.body = error.message;
      this.ctx.status = 500;
    }
  }
  // 删除规则
  @Post('/v1/user/delete')
  async deleteDemoUser(@Body() dto) {
    try {
      const deleteDemoUserRes = await this.CrudService.deleteDemoUser(dto);
      this.ctx.body = deleteDemoUserRes;
      this.ctx.status = 200;
    } catch (error) {
      this.ctx.body = error.message;
      this.ctx.status = 500;
    }
  }
  // 更新规则
  @Post('/v1/user/update')
  async updateDemoUser(@Body() dto) {
    const updateDemoUserRes = await this.CrudService.updateDemoUser(dto);
    return updateDemoUserRes;
  }
}
