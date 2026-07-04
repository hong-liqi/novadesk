import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JwtPayload } from '../types/jwt-payload';

export interface VerifyTokenOptions {
  issuer: string;
  audience: string | string[];
  jwksUrl: string;
  clockToleranceSec?: number;
}

export class TokenVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenVerificationError';
  }
}

export async function verifyAccessToken(
  token: string,
  options: VerifyTokenOptions,
): Promise<JwtPayload> {
  const jwks = createRemoteJWKSet(new URL(options.jwksUrl));

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: options.issuer,
      audience: options.audience,
      clockTolerance: options.clockToleranceSec ?? 5,
    });
    return payload as unknown as JwtPayload;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid token';
    throw new TokenVerificationError(message);
  }
}
