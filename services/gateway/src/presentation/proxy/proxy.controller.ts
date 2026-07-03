import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@portfolio/auth';

@ApiTags('proxy')
@Controller('status')
export class ProxyController {
  @Public()
  @Get()
  getStatus(): { status: string; service: string } {
    return { status: 'ok', service: 'gateway' };
  }
}
