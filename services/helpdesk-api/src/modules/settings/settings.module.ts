import { Module } from '@nestjs/common';
import { SettingController } from './presentation/controllers/setting.controller';
import { SettingRepository } from './infrastructure/persistence/setting.repository';
import { SETTING_REPOSITORY } from './application/ports/setting.repository.port';

@Module({
  controllers: [SettingController],
  providers: [
    {
      provide: SETTING_REPOSITORY,
      useClass: SettingRepository,
    },
  ],
  exports: [SETTING_REPOSITORY],
})
export class SettingsModule {}
