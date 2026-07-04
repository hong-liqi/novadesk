import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import type { AuthUser } from '@portfolio/auth';
import { JwtValidationService } from '@infrastructure/auth/jwt-validation.service';
import type { Server, Socket } from 'socket.io';
import { ChatRepository } from './chat.repository';
import {
  type JoinPayload,
  type MessagePayload,
  type PresencePayload,
  type TypingPayload,
  roomName,
} from './chat.types';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: AuthUser;
  };
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtValidationService: JwtValidationService,
    private readonly chatRepository: ChatRepository,
  ) {}

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect(true);
        return;
      }

      const { user } = await this.jwtValidationService.validateToken(token);
      client.data.user = user;
    } catch (error) {
      this.logger.warn({ err: error }, 'WebSocket authentication failed');
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    const user = client.data.user;
    if (!user) {
      return;
    }

    for (const room of client.rooms) {
      if (room.startsWith('ticket:')) {
        const ticketId = room.replace('ticket:', '');
        this.emitPresence(ticketId, user.id, false);
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: JoinPayload,
  ): { ok: true; room: string } | { ok: false; error: string } {
    const user = client.data.user;
    if (!user) {
      return { ok: false, error: 'Unauthorized' };
    }

    const room = roomName(payload.ticketId);
    void client.join(room);
    this.emitPresence(payload.ticketId, user.id, true);
    return { ok: true, room };
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: MessagePayload,
  ): Promise<
    | { ok: false; error: string }
    | { ok: true; message: Awaited<ReturnType<ChatRepository['createMessage']>> }
  > {
    const user = client.data.user;
    if (!user) {
      return { ok: false, error: 'Unauthorized' };
    }

    const trimmedBody = payload.body.trim();
    if (!trimmedBody) {
      return { ok: false, error: 'Message body is required' };
    }

    const message = await this.chatRepository.createMessage(payload.ticketId, user.id, trimmedBody);

    const room = roomName(payload.ticketId);
    this.server.to(room).emit('message', message);
    return { ok: true, message };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: TypingPayload,
  ): { ok: false; error: string } | { ok: true } {
    const user = client.data.user;
    if (!user) {
      return { ok: false, error: 'Unauthorized' };
    }

    const room = roomName(payload.ticketId);
    client.to(room).emit('typing', {
      ticketId: payload.ticketId,
      userId: user.id,
      isTyping: payload.isTyping,
    } satisfies TypingPayload & { userId: string });

    return { ok: true };
  }

  private emitPresence(ticketId: string, userId: string, online: boolean): void {
    const room = roomName(ticketId);
    this.server.to(room).emit('presence', {
      ticketId,
      userId,
      online,
    } satisfies PresencePayload);
  }

  private extractToken(client: Socket): string | undefined {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const queryToken = client.handshake.query?.token;
    if (typeof queryToken === 'string' && queryToken.length > 0) {
      return queryToken;
    }

    const authorization = client.handshake.headers.authorization;
    if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
      return authorization.slice('Bearer '.length);
    }

    return undefined;
  }
}
