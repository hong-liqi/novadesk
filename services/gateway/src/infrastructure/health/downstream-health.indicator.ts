import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, type HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class DownstreamHealthIndicator extends HealthIndicator {
  async isHealthy(key: string, serviceUrl: string): Promise<HealthIndicatorResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 3_000);

    try {
      const response = await fetch(`${serviceUrl}/api/v1/health/live`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Downstream returned ${String(response.status)}`);
      }

      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        `${key} check failed`,
        this.getStatus(key, false, { error: String(error) }),
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
