import type { Channel } from '../../domain/entities/channel.entity';

export const CHANNEL_REPOSITORY = Symbol('CHANNEL_REPOSITORY');

export interface ChannelRepositoryPort {
  findById(id: string): Promise<Channel | null>;
}
