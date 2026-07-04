import { Module } from '@nestjs/common';
import { ChannelController } from './presentation/controllers/channel.controller';
import { ChannelRepository } from './infrastructure/persistence/channel.repository';
import { CHANNEL_REPOSITORY } from './application/ports/channel.repository.port';

@Module({
  controllers: [ChannelController],
  providers: [
    {
      provide: CHANNEL_REPOSITORY,
      useClass: ChannelRepository,
    },
  ],
  exports: [CHANNEL_REPOSITORY],
})
export class ChannelsModule {}
