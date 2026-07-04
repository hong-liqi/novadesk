import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '@portfolio/auth';
import { DownstreamHealthIndicator } from '@infrastructure/health/downstream-health.indicator';
import { RedisHealthIndicator } from './redis-health.indicator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly downstreamHealth: DownstreamHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  aggregate() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const authServiceUrl = this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:3001',
    );
    const notificationServiceUrl = this.configService.get<string>(
      'NOTIFICATION_SERVICE_URL',
      'http://localhost:3002',
    );

    return this.health.check([
      () => this.redisHealth.isHealthy('redis', redisUrl),
      () => this.downstreamHealth.isHealthy('auth-service', authServiceUrl),
      () => this.downstreamHealth.isHealthy('notification-service', notificationServiceUrl),
    ]);
  }

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

    return this.health.check([() => this.redisHealth.isHealthy('redis', redisUrl)]);
  }
}
