import { Provide, Inject } from '@midwayjs/core';
import { User } from '../entity/user.entity';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { IUserOptions } from '../interface';
import * as svgCaptcha from 'svg-captcha';
import { IdGeneratorService } from '../utils/idGenerator';

@Provide()
export class UserService {
  @Inject()
  idGeneratorService: IdGeneratorService;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  async getUser(options: IUserOptions) {
    let allUsers = await this.userModel.find({});
    return allUsers;
  }

  async getCaptcha() {
    const captchaId = this.idGeneratorService.generateId();
    let code = svgCaptcha.create();
    return {
      captchaId: captchaId,
      verifyCode: code.data,
    };
  }
}
