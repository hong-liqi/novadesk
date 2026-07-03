import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const DATABASE_TOKEN = Symbol('DATABASE');

export interface DatabaseConnection {
  url: string | undefined;
  isConfigured: boolean;
}

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DatabaseConnection => {
        const url = configService.get<string>('DATABASE_URL');
        return {
          url,
          isConfigured: Boolean(url),
        };
      },
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DatabaseModule {}
