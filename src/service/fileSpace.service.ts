import { Provide, Inject } from '@midwayjs/core';
import { FileSpace } from '../entity/fileSpace.entity';
import { FileSpaceList } from '../entity/fileSpaceList.entity';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import { IdGeneratorService } from '../utils/idGenerator';
import { RedisService } from '@midwayjs/redis';

@Provide()
export class FileSpaceService {
  @Inject()
  idGeneratorService: IdGeneratorService;

  @Inject()
  redisService: RedisService;

  @InjectEntityModel(FileSpace)
  fileSpaceModel: Repository<FileSpace>;

  @InjectEntityModel(FileSpaceList)
  fileSpaceListModel: Repository<FileSpaceList>;

  async getClassifyList() {
    let result = await this.fileSpaceModel.find({});
    return result;
  }
  // 获取该分类下的文件列表
  async getFileList(dto) {
    const { classifyId, pageNo, pageSize } = dto;
    let offset = (pageNo - 1) * pageSize;
    const result = await this.fileSpaceListModel.findAndCount({
      where: {
        classify_id: classifyId,
      },
      order: {
        create_time: 'DESC',
      },
      skip: offset,
      take: pageSize,
    });
    return {
      list: result[0],
      pagination: {
        pageNo,
        pageSize,
        total: result[1],
      },
    };
  };
  // 添加分类
  async addClassify(dto) {
    const { name } = dto;
    const checkResult = await this.fileSpaceModel.findOne({
      where: { name: name }
    });
    if (checkResult) {
      throw new Error('该类别已存在');
    } else {
      let fileSpace = new FileSpace();
      fileSpace.name = name;
      fileSpace.create_time = new Date();
      const result = await this.fileSpaceModel.save(fileSpace);
      return result;
    }
  }
  // 更新分类
  async updateClassify(dto) {
    const { id, name } = dto;
    const checkResult = await this.fileSpaceModel.findOne({
      where: { id: id }
    });
    if (!checkResult) {
      throw new Error('错误的请求参数');
    }
    console.log(1)
    checkResult.name = name;
    checkResult.update_time = new Date();
    const result = await this.fileSpaceModel.save(checkResult);
    return result;
  }
  // 删除分类
  async deleteClassify(dto) {
    const { id } = dto;
    let count = id.length;
    const checkResult = await this.fileSpaceModel.find({
      where: { id: In(id) }
    });
    if (checkResult.length !== count) {
      throw new Error('所选条目不存在');
    }
    await this.fileSpaceModel.remove(checkResult);
    await this.deleteFileByClassify(id);
    return {};
  }
  // 添加文件
  async addFile(dto) {
    const { classifyId, fileId, name, size, type, url } = dto;
    let fileSpaceList = new FileSpaceList();
    fileSpaceList.classify_id = classifyId;
    fileSpaceList.file_id = fileId;
    fileSpaceList.name = name;
    fileSpaceList.size = size;
    fileSpaceList.type = type;
    fileSpaceList.url = url;
    const result = await this.fileSpaceListModel.save(fileSpaceList);
    return result;
  }
  // 删除文件
  async deleteFile(dto) {
    const { id } = dto;
    const checkResult = await this.fileSpaceListModel.find({
      where: { id: In(id) }
    });
    if (checkResult.length) {
      await this.fileSpaceListModel.remove(checkResult);
    }
    return {};
  }
  // 删除类别下所有文件
  async deleteFileByClassify(classifyId) {
    const checkResult = await this.fileSpaceListModel.find({
      where: { classify_id: In(classifyId) }
    });
    if (checkResult.length) {
      await this.fileSpaceListModel.remove(checkResult);
    }
    return {};
  }
}
