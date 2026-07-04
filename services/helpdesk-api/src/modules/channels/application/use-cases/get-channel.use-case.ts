import { Inject, Injectable } from '@nestjs/common';
import type { Channel } from '../../domain/entities/channel.entity';
import { CHANNEL_REPOSITORY, type ChannelRepositoryPort } from '../ports/channel.repository.port';

@Injectable()
export class GetChannelUseCase {
  constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly repository: ChannelRepositoryPort,
  ) {}

  execute(id: string): Promise<Channel | null> {
    return this.repository.findById(id);
  }
}
