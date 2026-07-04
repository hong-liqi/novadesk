import { Injectable } from '@nestjs/common';
import type { Notification } from '../../domain/entities/notification.entity';
import type { NotificationRepositoryPort } from '../../application/ports/notification.repository.port';

@Injectable()
export class NotificationRepository implements NotificationRepositoryPort {
  findById(_id: string): Promise<Notification | null> {
    return Promise.resolve(null);
  }
}
