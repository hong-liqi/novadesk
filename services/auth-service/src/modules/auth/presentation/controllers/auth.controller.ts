import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, CurrentUser } from '@novadesk/auth';
import type { AuthUser } from '@novadesk/auth';
import type { Request, Response } from 'express';
import type {
  AuthTokensResponse,
  LoginDto,
  LogoutDto,
  MeResponse,
  RefreshDto,
  RegisterDto,
} from '../../application/dto/auth.dto';
import { GetMeUseCase } from '../../application/use-cases/get-me.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RefreshUseCase } from '../../application/use-cases/refresh.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';

const REFRESH_COOKIE = 'refresh_token';

function getRefreshCookie(req: Request): string | undefined {
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.[REFRESH_COOKIE];
}

function extractMeta(req: Request) {
  return {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };
}

function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Public()
  @Throttle({ auth: { limit: 20, ttl: 900_000 } })
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthTokensResponse, 'refreshToken'>> {
    const tokens = await this.registerUseCase.execute(dto, extractMeta(req));
    setRefreshCookie(res, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType,
    };
  }

  @Public()
  @Throttle({ auth: { limit: 20, ttl: 900_000 } })
  @Post('login')
  @ApiOperation({ summary: 'Authenticate with email and password' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthTokensResponse, 'refreshToken'>> {
    const tokens = await this.loginUseCase.execute(dto, extractMeta(req));
    setRefreshCookie(res, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType,
    };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate refresh token and issue new access token' })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthTokensResponse, 'refreshToken'>> {
    const refreshToken = dto.refreshToken ?? getRefreshCookie(req);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    const tokens = await this.refreshUseCase.execute({ refreshToken });
    setRefreshCookie(res, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  async logout(
    @CurrentUser() user: AuthUser | undefined,
    @Body() dto: LogoutDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: true }> {
    const refreshToken = dto.refreshToken ?? getRefreshCookie(req);
    await this.logoutUseCase.execute(user, { refreshToken }, extractMeta(req));
    clearRefreshCookie(res);
    return { success: true };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  async me(@CurrentUser() user: AuthUser): Promise<MeResponse> {
    return this.getMeUseCase.execute(user.id);
  }
}
