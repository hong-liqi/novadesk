import { Injectable } from '@nestjs/common';
import type { Channel } from '../../domain/entities/channel.entity';
import type { ChannelRepositoryPort } from '../../application/ports/channel.repository.port';

@Injectable()
export class ChannelRepository implements ChannelRepositoryPort {
  findById(_id: string): Promise<Channel | null> {
    return Promise.resolve(null);
  }
}
