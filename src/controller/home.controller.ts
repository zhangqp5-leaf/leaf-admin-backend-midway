import { Controller, Get } from '@midwayjs/core';
import { homeInfo } from '../utils/const';

@Controller('/api')
export class HomeController {
  @Get('/home/info')
  async home() {
    return homeInfo;
  }
}
