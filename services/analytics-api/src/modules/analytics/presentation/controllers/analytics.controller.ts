import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { parseQuery } from '@presentation/validators/parse-query';
import type { KpisResponseDto, TrendsResponseDto } from '../../application/dto/analytics.dto';
import {
  ExportCsvUseCase,
  GetKpisUseCase,
  GetTrendsUseCase,
} from '../../application/use-cases/analytics.use-cases';
import { trendsQuerySchema, workspaceQuerySchema } from '../validators/analytics.validator';

@ApiTags('analytics')
@Controller()
export class AnalyticsController {
  constructor(
    private readonly getKpis: GetKpisUseCase,
    private readonly getTrends: GetTrendsUseCase,
    private readonly exportCsv: ExportCsvUseCase,
  ) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Get workspace KPI snapshot' })
  getKpisHandler(@Query() query: unknown): Promise<KpisResponseDto> {
    const { workspaceId } = parseQuery(workspaceQuerySchema, query);
    return this.getKpis.execute(workspaceId);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get daily ticket trend metrics' })
  getTrendsHandler(@Query() query: unknown): Promise<TrendsResponseDto> {
    const parsed = parseQuery(trendsQuerySchema, query);
    const days = parsed.days ?? 7;
    return this.getTrends.execute(parsed.workspaceId, days);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export workspace analytics as CSV' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="analytics-export.csv"')
  exportHandler(@Query() query: unknown): Promise<string> {
    const { workspaceId } = parseQuery(workspaceQuerySchema, query);
    return this.exportCsv.execute(workspaceId);
  }
}
