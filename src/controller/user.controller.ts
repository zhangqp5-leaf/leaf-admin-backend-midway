import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  UserService: UserService;

  @Get('/admin/base/open/captcha')
  async getCaptcha() {
    const captchaRes = await this.UserService.getCaptcha();
    return captchaRes;
  }
}