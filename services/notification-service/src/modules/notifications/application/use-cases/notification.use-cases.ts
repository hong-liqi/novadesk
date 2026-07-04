import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@generated/prisma';
import type {
  CreateNotificationDto,
  ListNotificationsQuery,
  NotificationResponse,
  UnreadCountResponse,
  UpdateNotificationDto,
} from '../dto/notification.dto';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepositoryPort,
} from '../ports/notification.repository.port';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepositoryPort,
  ) {}

  async execute(query: ListNotificationsQuery): Promise<NotificationResponse[]> {
    const items = await this.notifications.findByUser({
      userId: query.userId,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
      unreadOnly: query.unreadOnly,
    });

    return items.map(mapNotification);
  }
}

@Injectable()
export class GetUnreadCountUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepositoryPort,
  ) {}

  async execute(userId: string): Promise<UnreadCountResponse> {
    const count = await this.notifications.countUnread(userId);
    return { count };
  }
}

@Injectable()
export class GetNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepositoryPort,
  ) {}

  async execute(id: string): Promise<NotificationResponse> {
    const notification = await this.notifications.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return mapNotification(notification);
  }
}

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepositoryPort,
  ) {}

  async execute(dto: CreateNotificationDto): Promise<NotificationResponse> {
    const notification = await this.notifications.create({
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
      type: dto.type,
      metadata: dto.metadata as Prisma.InputJsonValue | undefined,
    });

    return mapNotification(notification);
  }
}

@Injectable()
export class UpdateNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateNotificationDto): Promise<NotificationResponse> {
    const existing = await this.notifications.findById(id);
    if (!existing) {
      throw new NotFoundException('Notification not found');
    }

    const notification = await this.notifications.update(id, {
      title: dto.title,
      body: dto.body,
      type: dto.type,
      metadata: dto.metadata as Prisma.InputJsonValue | undefined,
    });
    return mapNotification(notification);
  }
}

@Injectable()
export class MarkAsReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepositoryPort,
  ) {}

  async execute(id: string): Promise<NotificationResponse> {
    const existing = await this.notifications.findById(id);
    if (!existing) {
      throw new NotFoundException('Notification not found');
    }

    const notification = await this.notifications.markAsRead(id);
    return mapNotification(notification);
  }
}

@Injectable()
export class DeleteNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notifications: NotificationRepositoryPort,
  ) {}

  async execute(id: string): Promise<{ success: true }> {
    const existing = await this.notifications.findById(id);
    if (!existing) {
      throw new NotFoundException('Notification not found');
    }

    await this.notifications.delete(id);
    return { success: true };
  }
}

function mapNotification(notification: {
  id: string;
  userId: string;
  title: string;
  body: string | null;
  type: NotificationResponse['type'];
  isRead: boolean;
  metadata: unknown;
  readAt: Date | null;
  createdAt: Date;
}): NotificationResponse {
  return {
    id: notification.id,
    userId: notification.userId,
    title: notification.title,
    body: notification.body,
    type: notification.type,
    isRead: notification.isRead,
    metadata: isRecord(notification.metadata) ? notification.metadata : null,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
