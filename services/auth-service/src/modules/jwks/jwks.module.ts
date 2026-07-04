import { Module } from '@nestjs/common';
import { AuthServicesModule } from '@infrastructure/auth/auth-services.module';
import { JwksController } from './presentation/controllers/jwks.controller';

@Module({
  imports: [AuthServicesModule],
  controllers: [JwksController],
})
export class JwksModule {}
