import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentWorkspace } from '@presentation/decorators/current-workspace.decorator';
import { WorkspaceGuard } from '@presentation/guards/workspace.guard';
import type { DashboardStatsResponseDto } from '../../application/dto/dashboard.dto';
import { GetDashboardStatsUseCase } from '../../application/use-cases/dashboard.use-cases';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(WorkspaceGuard)
export class DashboardController {
  constructor(private readonly getDashboardStats: GetDashboardStatsUseCase) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get workspace dashboard statistics' })
  getStats(@CurrentWorkspace() workspaceId: string): Promise<DashboardStatsResponseDto> {
    return this.getDashboardStats.execute(workspaceId);
  }
}
