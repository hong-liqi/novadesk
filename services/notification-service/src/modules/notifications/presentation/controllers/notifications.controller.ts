import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
  CreateNotificationDto,
  ListNotificationsQuery,
  NotificationResponse,
  UnreadCountResponse,
  UpdateNotificationDto,
} from '../../application/dto/notification.dto';
import {
  CreateNotificationUseCase,
  DeleteNotificationUseCase,
  GetNotificationUseCase,
  GetUnreadCountUseCase,
  ListNotificationsUseCase,
  MarkAsReadUseCase,
  UpdateNotificationUseCase,
} from '../../application/use-cases/notification.use-cases';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly listNotifications: ListNotificationsUseCase,
    private readonly getUnreadCount: GetUnreadCountUseCase,
    private readonly getNotification: GetNotificationUseCase,
    private readonly createNotification: CreateNotificationUseCase,
    private readonly updateNotification: UpdateNotificationUseCase,
    private readonly markAsRead: MarkAsReadUseCase,
    private readonly deleteNotification: DeleteNotificationUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List in-app notifications for a user' })
  findAll(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ): Promise<NotificationResponse[]> {
    const query: ListNotificationsQuery = {
      userId,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      unreadOnly: unreadOnly === 'true',
    };

    return this.listNotifications.execute(query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count for a user' })
  unreadCount(@Query('userId', ParseUUIDPipe) userId: string): Promise<UnreadCountResponse> {
    return this.getUnreadCount.execute(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NotificationResponse> {
    return this.getNotification.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an in-app notification' })
  create(@Body() dto: CreateNotificationDto): Promise<NotificationResponse> {
    return this.createNotification.execute(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an in-app notification' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNotificationDto,
  ): Promise<NotificationResponse> {
    return this.updateNotification.execute(id, dto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markRead(@Param('id', ParseUUIDPipe) id: string): Promise<NotificationResponse> {
    return this.markAsRead.execute(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ success: true }> {
    return this.deleteNotification.execute(id);
  }
}
