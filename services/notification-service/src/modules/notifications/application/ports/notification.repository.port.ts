import type { Notification, NotificationType, Prisma } from '@generated/prisma';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface CreateNotificationInput {
  userId: string;
  title: string;
  body?: string;
  type?: NotificationType;
  metadata?: Prisma.InputJsonValue;
}

export interface UpdateNotificationInput {
  title?: string;
  body?: string;
  type?: NotificationType;
  metadata?: Prisma.InputJsonValue;
}

export interface ListNotificationsInput {
  userId: string;
  limit: number;
  offset: number;
  unreadOnly?: boolean;
}

export interface NotificationRepositoryPort {
  findByUser(input: ListNotificationsInput): Promise<Notification[]>;
  countUnread(userId: string): Promise<number>;
  findById(id: string): Promise<Notification | null>;
  create(input: CreateNotificationInput): Promise<Notification>;
  update(id: string, input: UpdateNotificationInput): Promise<Notification>;
  markAsRead(id: string): Promise<Notification>;
  delete(id: string): Promise<void>;
}
