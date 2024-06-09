import { Provide, Inject } from '@midwayjs/core';
import { User } from '../entity/user.entity';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { IUserOptions } from '../interface';
import * as svgCaptcha from 'svg-captcha';
import { IdGeneratorService } from '../utils/idGenerator';
import { RedisService } from '@midwayjs/redis';
let jsonWebToken = require('jsonwebtoken')

@Provide()
export class UserService {
  @Inject()
  idGeneratorService: IdGeneratorService;

  @Inject()
  redisService: RedisService;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  async getUser(options: IUserOptions) {
    let allUsers = await this.userModel.find({});
    return allUsers;
  }
  // 获取验证码
  async getCaptcha() {
    const captchaId = this.idGeneratorService.generateId();
    let code = svgCaptcha.create();
    await this.redisService.set(captchaId, code.text.toLowerCase(), 'EX', 300);
    return {
      captchaId: captchaId,
      verifyCode: code.data,
    };
  }
  // 获取登录用户
  async getCurrentUser(username: string) {
    let currentUser = await this.userModel.findOne({
      where: { username: username }
    });
    return currentUser;
  }
  // 登录
  async login(dto) {
    const {username, password, verifyCode, captchaId} = dto;
    // 验证验证码
    const storedCode = await this.redisService.get(captchaId);
    if (!storedCode) {
      throw new Error('验证码已过期');
    } else if (storedCode !== verifyCode) {
      throw new Error('验证码错误');
    }
    console.log(verifyCode, captchaId);
    const result = await this.userModel.findOne({
      where: { username: username, password: password }
    });
    if (result) {
      return {
        data: result,
        token: jsonWebToken.sign({
          username: username,
          role: result.role,
        }, '1997', {
          expiresIn: "8h",
        }),
      }
    } else {
      throw new Error('用户名或密码错误');
    }
  }
  // 获取所有用户
  async getAllUser() {
    const result = await this.userModel.find({});
    if (result) {
      return result;
    } else {
      throw new Error('获取用户失败');
    }
  }
  // 更新用户信息
  async updatePerson(dto) {
    const { headImg, nickname, oldPassword, password, username } = dto;
    const checkResult = await this.userModel.findOne({ where: { username: username} });
    console.log('checkResult', checkResult.password);
    if (!checkResult) {
      throw new Error('用户不存在');
    }
    if (oldPassword && checkResult.password !== oldPassword) {
      throw new Error('原密码错误');
    }
    if (oldPassword && password) {
      checkResult.password = password;
    }
    if (headImg) {
      checkResult.headImg = headImg;
    }
    if (nickname) {
      checkResult.nickname = nickname;
    }
    if (!headImg && !nickname) {
      throw new Error('没有可更新信息');
    }
    const result = await this.userModel.save(checkResult);
    if (!result) {
      throw new Error('修改失败');
    }
    return result;
  }
}
