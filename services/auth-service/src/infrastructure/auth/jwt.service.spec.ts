import { ConfigService } from '@nestjs/config';
import { generateKeyPairSync } from 'node:crypto';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const configService = {
    get: (key: string, defaultValue?: string) => {
      const values: Record<string, string> = {
        JWT_PRIVATE_KEY: privateKey,
        JWT_PUBLIC_KEY: publicKey,
        JWT_KID: 'test-kid',
        JWT_ISSUER: 'novadesk-auth',
        JWT_AUDIENCE: 'novadesk',
        ACCESS_TOKEN_TTL: '15m',
      };
      return values[key] ?? defaultValue;
    },
  } as ConfigService;

  let service: JwtService;

  beforeEach(() => {
    service = new JwtService(configService);
    service.onModuleInit();
  });

  it('signs and verifies RS256 access tokens', async () => {
    const token = await service.signAccessToken({
      sub: 'user-1',
      email: 'user@example.com',
      roles: ['user'],
      tenantId: 'tenant-1',
    });

    const payload = await service.verifyAccessToken(token);

    expect(payload.sub).toBe('user-1');
    expect(payload.email).toBe('user@example.com');
    expect(payload.roles).toEqual(['user']);
    expect(payload.tenantId).toBe('tenant-1');
    expect(payload.iss).toBe('novadesk-auth');
    expect(payload.jti).toBeTruthy();
  });

  it('exports JWKS with configured kid', async () => {
    const jwks = await service.getJwks();

    expect(jwks.keys).toHaveLength(1);
    expect(jwks.keys[0]?.kid).toBe('test-kid');
    expect(jwks.keys[0]?.alg).toBe('RS256');
    expect(jwks.keys[0]?.use).toBe('sig');
  });

  it('rejects tampered tokens', async () => {
    const token = await service.signAccessToken({
      sub: 'user-1',
      email: 'user@example.com',
      roles: ['user'],
    });

    const parts = token.split('.');
    const header = parts[0];
    const body = parts[1];
    if (!header || !body) {
      throw new Error('Invalid token format');
    }
    const tampered = `${header}.${body}.invalid-signature`;

    await expect(service.verifyAccessToken(tampered)).rejects.toThrow();
  });
});
