import { Provide, Inject } from '@midwayjs/core';
import { DemoUser } from '../entity/demoUser.entity';
import { DemoRule } from '../entity/demoRule.entity';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { IdGeneratorService } from '../utils/idGenerator';

@Provide()
export class CrudService {
  @Inject()
  idGeneratorService: IdGeneratorService;

  @InjectEntityModel(DemoUser)
  demoUserModel: Repository<DemoUser>;

  @InjectEntityModel(DemoRule)
  demoRuleModel: Repository<DemoRule>;
  
  // 获取列表
  async getDemoUserList(dto) {
    const { name, nickName, gender, current, pageSize } = dto;
    console.log({ name, nickName, gender, current, pageSize })
    let offset = (current - 1) * pageSize;
    const result = await this.demoUserModel.findAndCount({
      where: {
        gender: gender || undefined,
        name: name ? Like(`%${name}%`) : undefined,
        nick_name: nickName ? Like(`%${nickName}%`) : undefined,
      },
      order: { create_time: 'DESC'},
      skip: offset,
      take: pageSize,
    });
    return {
      list: result[0],
      pagination: {
        current,
        pageSize,
        total: result[1],
      },
    };
  }
  // 添加规则
  async addDemoUser(dto) {
    const { name, nickName, gender } = dto;
    const checkResult = await this.demoUserModel.findOne({
      where: { name: name }
    });
    if (checkResult) {
      throw new Error('用户名已存在');
    }
    let demoUser = new DemoUser();
    demoUser.name = name;
    demoUser.nick_name = nickName;
    demoUser.gender = gender;
    const result = await this.demoUserModel.save(demoUser);
    return result;
  }
  // 删除规则
  async deleteDemoUser(dto) {
    const { ids } = dto;
    const checkResult = await this.demoUserModel.find({
      where: { id: In(ids) }
    });
    const result = await this.demoUserModel.remove(checkResult);
    if (result) {
      return result;
    } else {
      throw new Error('删除失败');
    }
  }
  // 更新规则
  async updateDemoUser(dto) {
    const { id, name, desc, frequency, target, template, time, type='1' } = dto;
    const checkResult = await this.demoRuleModel.findOne({
      where: { id: id }
    });
    if (checkResult) {
      // 更新
      checkResult.name = name;
      checkResult.desc = desc;
      checkResult.frequency = frequency;
      checkResult.target = target;
      checkResult.template = template;
      checkResult.time = time;
      checkResult.type = type;
      await this.demoRuleModel.save(checkResult);
    } else {
      // 新增
      let demoRule = new DemoRule();
      demoRule.name = name;
      demoRule.desc = desc;
      demoRule.frequency = frequency;
      demoRule.target = target;
      demoRule.template = template;
      demoRule.time = time;
      demoRule.type = type;
      await this.demoRuleModel.save(demoRule);
    }
    return {};
  }
}
