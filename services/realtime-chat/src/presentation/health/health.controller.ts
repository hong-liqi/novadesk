import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '@portfolio/auth';
import { PrismaHealthIndicator } from './prisma-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('live')
  live(): { status: string } {
    return { status: 'ok' };
  }

  @Public()
  @Get('ready')
  @HealthCheck()
  ready() {
    const redisUrl = this.configService.get<string>('REDIS_URL');

    return this.health.check([
      () => this.redisHealth.isHealthy('redis', redisUrl),
      () => this.prismaHealth.isHealthy('database'),
    ]);
  }
}
