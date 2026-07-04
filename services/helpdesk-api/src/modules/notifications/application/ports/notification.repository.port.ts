import type { Notification } from '../../domain/entities/notification.entity';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface NotificationRepositoryPort {
  findById(id: string): Promise<Notification | null>;
}
