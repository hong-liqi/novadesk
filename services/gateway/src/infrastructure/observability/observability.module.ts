import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupOpenTelemetry } from './otel';

@Module({})
export class ObservabilityModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const serviceName = this.configService.get<string>('SERVICE_NAME', 'gateway');
    setupOpenTelemetry(serviceName);
  }
}
