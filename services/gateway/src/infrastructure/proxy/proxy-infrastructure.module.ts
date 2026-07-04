import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GatewayThrottlerMiddleware } from '@infrastructure/middleware/gateway-throttler.middleware';
import { RequestIdMiddleware } from '@infrastructure/middleware/request-id.middleware';
import { JwtValidationService } from './jwt-validation.service';
import { ProxyAuthMiddleware } from './proxy-auth.middleware';
import { ProxyMiddleware } from './proxy.middleware';
import { ProxyService } from './proxy.service';

@Module({
  providers: [
    ProxyService,
    JwtValidationService,
    RequestIdMiddleware,
    GatewayThrottlerMiddleware,
    ProxyAuthMiddleware,
    ProxyMiddleware,
  ],
  exports: [ProxyService, JwtValidationService],
})
export class ProxyInfrastructureModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware, GatewayThrottlerMiddleware, ProxyAuthMiddleware, ProxyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
