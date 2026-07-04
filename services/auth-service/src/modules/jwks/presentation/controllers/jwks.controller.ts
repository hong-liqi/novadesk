import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@portfolio/auth';
import { JwtService } from '@infrastructure/auth/jwt.service';

@ApiTags('jwks')
@Controller('.well-known')
export class JwksController {
  constructor(private readonly jwtService: JwtService) {}

  @Public()
  @Get('jwks.json')
  @ApiOperation({ summary: 'JSON Web Key Set for JWT verification' })
  getJwks() {
    return this.jwtService.getJwks();
  }
}
