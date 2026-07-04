import { jwtVerify } from 'jose';
import { verifyAccessToken, TokenVerificationError } from './verify-token';

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(() => 'jwks'),
  jwtVerify: jest.fn(),
}));

describe('verifyAccessToken', () => {
  it('returns payload for valid tokens', async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({
      payload: {
        sub: 'user-1',
        email: 'user@example.com',
        roles: ['user'],
        iat: 1,
        exp: 999,
        jti: 'token-1',
      },
    });

    const payload = await verifyAccessToken('token', {
      issuer: 'novadesk',
      audience: 'novadesk-api',
      jwksUrl: 'https://auth.example.com/.well-known/jwks.json',
    });

    expect(payload.sub).toBe('user-1');
  });

  it('throws TokenVerificationError for invalid tokens', async () => {
    (jwtVerify as jest.Mock).mockRejectedValue(new Error('signature mismatch'));

    await expect(
      verifyAccessToken('bad-token', {
        issuer: 'novadesk',
        audience: 'novadesk-api',
        jwksUrl: 'https://auth.example.com/.well-known/jwks.json',
      }),
    ).rejects.toBeInstanceOf(TokenVerificationError);
  });
});
