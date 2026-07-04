import { Module } from '@nestjs/common';
import { NotificationController } from './presentation/controllers/notification.controller';
import { NotificationRepository } from './infrastructure/persistence/notification.repository';
import { NOTIFICATION_REPOSITORY } from './application/ports/notification.repository.port';

@Module({
  controllers: [NotificationController],
  providers: [
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
  ],
  exports: [NOTIFICATION_REPOSITORY],
})
export class NotificationsModule {}
