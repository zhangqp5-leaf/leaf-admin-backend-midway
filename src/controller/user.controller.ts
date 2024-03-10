import { Inject, Controller, Get, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

@Controller('/api')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  UserService: UserService;

  // 获取验证码
  @Get('/admin/base/open/captcha')
  async getCaptcha() {
    const captchaRes = await this.UserService.getCaptcha();
    return captchaRes;
  }
  // 获取当前登录用户
  @Get('/admin/base/open/currentUser')
  async getCurrentUser() {
    const username = this.ctx.cookies.get('username', { encrypt: true });
    const currentUserRes = await this.UserService.getCurrentUser(username);
    return currentUserRes;
  }
  // 登录
  @Post('/admin/base/open/login')
  async login(@Body() dto) {
    try {
      const loginRes = await this.UserService.login(dto);
      this.ctx.cookies.set('username', loginRes.data.username, { encrypt: true });
      this.ctx.cookies.set('role', loginRes.data.role, { encrypt: true });
      this.ctx.body = loginRes;
      this.ctx.status = 200;
    } catch(error) {
      this.ctx.status = 500;
      this.ctx.body = error.message;
    }
  }
  // 退出登录
  @Post('/admin/base/comm/logout')
  async logout() {
    this.ctx.cookies.set('username', '', { encrypt: true });
    this.ctx.cookies.set('role', '', { encrypt: true });
    return {};
  }
  // 获取所有用户
  @Get('/admin/base/open/allUser')
  async getAllUser() {
    try {
      const allUserRes = await this.UserService.getAllUser();
      this.ctx.body = allUserRes;
      this.ctx.status = 200;
    } catch(error) {
      this.ctx.status = 500;
      this.ctx.body = error.message;
    }
  }
  // 更新用户信息
  @Post('/admin/base/comm/personUpdate')
  async updatePerson(@Body() dto) {
    try {
      const _dto = { ...dto, username: this.ctx.cookies.get('username', { encrypt: true })};
      const updatePersonRes = await this.UserService.updatePerson(_dto);
      this.ctx.body = updatePersonRes;
      this.ctx.status = 200;
    } catch (error) {
      this.ctx.status = 500;
      this.ctx.body = error.message;
    }
  }
}