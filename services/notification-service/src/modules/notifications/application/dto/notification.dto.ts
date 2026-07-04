import type { NotificationType } from '@generated/prisma';

export interface CreateNotificationDto {
  userId: string;
  title: string;
  body?: string;
  type?: NotificationType;
  metadata?: Record<string, unknown>;
}

export interface UpdateNotificationDto {
  title?: string;
  body?: string;
  type?: NotificationType;
  metadata?: Record<string, unknown>;
}

export interface ListNotificationsQuery {
  userId: string;
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  body: string | null;
  type: NotificationType;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface UnreadCountResponse {
  count: number;
}
