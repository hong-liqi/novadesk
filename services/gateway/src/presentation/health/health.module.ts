import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DownstreamHealthIndicator } from '@infrastructure/health/downstream-health.indicator';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './redis-health.indicator';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator, DownstreamHealthIndicator],
})
export class HealthModule {}
