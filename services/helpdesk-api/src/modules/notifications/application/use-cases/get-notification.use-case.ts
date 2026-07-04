import { Inject, Injectable } from '@nestjs/common';
import type { Notification } from '../../domain/entities/notification.entity';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepositoryPort,
} from '../ports/notification.repository.port';

@Injectable()
export class GetNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryPort,
  ) {}

  execute(id: string): Promise<Notification | null> {
    return this.repository.findById(id);
  }
}
