import { Module } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY } from './application/ports/notification.repository.port';
import {
  CreateNotificationUseCase,
  DeleteNotificationUseCase,
  GetNotificationUseCase,
  GetUnreadCountUseCase,
  ListNotificationsUseCase,
  MarkAsReadUseCase,
  UpdateNotificationUseCase,
} from './application/use-cases/notification.use-cases';
import { NotificationRepository } from './infrastructure/persistence/notification.repository';
import { NotificationsController } from './presentation/controllers/notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [
    ListNotificationsUseCase,
    GetUnreadCountUseCase,
    GetNotificationUseCase,
    CreateNotificationUseCase,
    UpdateNotificationUseCase,
    MarkAsReadUseCase,
    DeleteNotificationUseCase,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
  ],
  exports: [NOTIFICATION_REPOSITORY],
})
export class NotificationsModule {}
