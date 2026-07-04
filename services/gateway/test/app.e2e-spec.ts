import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('Gateway (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.SERVICE_NAME = 'gateway';
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.AUTH_SERVICE_URL = 'http://localhost:3001';
    process.env.NOTIFICATION_SERVICE_URL = 'http://localhost:3002';
    process.env.HELPDESK_SERVICE_URL = 'http://localhost:3003';
    process.env.ANALYTICS_SERVICE_URL = 'http://localhost:3004';
    process.env.AUTH_JWKS_URL = 'http://localhost:3001/.well-known/jwks.json';

    const { AppModule } = await import('../src/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/v1/health/live returns ok', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/live')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('GET /api/v1/status returns gateway status', () => {
    return request(app.getHttpServer())
      .get('/api/v1/status')
      .expect(200)
      .expect({ status: 'ok', service: 'gateway' });
  });
});
