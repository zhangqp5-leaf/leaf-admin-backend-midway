import { Inject, Controller, Get, Query, Post, Body, Files, Fields } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { FileSpaceService } from '../service/fileSpace.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/api')
export class FileSpaceController {
  @Inject()
  ctx: Context;

  @Inject()
  FileSpaceService: FileSpaceService;

  // 获取分类列表
  @Get('/admin/space/type/page')
  async getClassifyList() {
    const classifyListRes = await this.FileSpaceService.getClassifyList();
    return classifyListRes;
  }
  // 获取该分类下的文件列表
  @Get('/admin/space/info/page')
  async getFileList(@Query() dto) {
    const fileListRes = await this.FileSpaceService.getFileList(dto);
    return fileListRes;
  }
  // 添加分类
  @Post('/admin/space/type/add')
  async addClassify(@Body() dto) {
    try {
      const addClassifyRes = await this.FileSpaceService.addClassify(dto);
      this.ctx.body = addClassifyRes;
      this.ctx.status = 200;
    } catch (error) {
      this.ctx.status = 500;
      this.ctx.body = error.message;
    }
  }
  // 更新分类
  @Post('/admin/space/type/update')
  async updateClassify(@Body() dto) {
    try {
      const updateClassifyRes = await this.FileSpaceService.updateClassify(dto);
      this.ctx.body = updateClassifyRes;
      this.ctx.status = 200;
    } catch (error) {
      this.ctx.status = 500;
      this.ctx.body = error.message;
    }
  }
  // 删除分类
  @Post('/admin/space/type/delete')
  async deleteClassify(@Body() dto) {
    try {
      const deleteClassifyRes = await this.FileSpaceService.deleteClassify(dto);
      this.ctx.body = deleteClassifyRes;
      this.ctx.status = 200;
    } catch(error) {
      this.ctx.status = 500;
      this.ctx.body = error.message;
    }
  }
  // 上传文件
  @Post('/admin/base/comm/upload')
  async uploadFile(@Files() files, @Fields() fields) {
    const file = files[0];
    const filename = file.filename;
    console.log({filename});
    const target = path.join('/root/backend/leaf-admin-backend/public/images', filename);

    // 使用fs模块将临时文件保存到目标路径
    const readStream = fs.createReadStream(file.data);
    const writeStream = fs.createWriteStream(target);
    readStream.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', err => reject(err));
    });
    return {
      url: `http://118.31.168.157:2119/static/images/${filename}`,
    }
  }
  // 添加文件
  @Post('/admin/space/info/add')
  async addFile(@Body() dto) {
    const addFileRes = await this.FileSpaceService.addFile(dto);
    return addFileRes;
  }
  // 删除文件
  @Post('/admin/space/info/delete')
  async deleteFile(@Body() dto) {
    try {
      const id = dto.id;
      const deleteFileRes = await this.FileSpaceService.deleteFile({ id: [id] });
      this.ctx.body = deleteFileRes;
      this.ctx.status = 200;
    } catch(error) {
      this.ctx.status = 500;
      this.ctx.body = error.message;
    }
  }
}
