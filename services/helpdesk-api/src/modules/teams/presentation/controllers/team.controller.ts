import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID (scaffold)' })
  findOne(@Param('id', ParseUUIDPipe) _id: string): never {
    throw new Error('Not implemented — architecture scaffold only');
  }
}
