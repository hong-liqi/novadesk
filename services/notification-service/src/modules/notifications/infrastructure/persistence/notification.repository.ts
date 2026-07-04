import { Injectable } from '@nestjs/common';
import type { Notification } from '@generated/prisma';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type {
  CreateNotificationInput,
  ListNotificationsInput,
  NotificationRepositoryPort,
  UpdateNotificationInput,
} from '../../application/ports/notification.repository.port';

@Injectable()
export class NotificationRepository implements NotificationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  findByUser(input: ListNotificationsInput): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        userId: input.userId,
        ...(input.unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: input.limit,
      skip: input.offset,
    });
  }

  countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  create(input: CreateNotificationInput): Promise<Notification> {
    return this.prisma.notification.create({ data: input });
  }

  update(id: string, input: UpdateNotificationInput): Promise<Notification> {
    return this.prisma.notification.update({ where: { id }, data: input });
  }

  markAsRead(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({ where: { id } });
  }
}
