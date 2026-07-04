import { Injectable } from '@nestjs/common';
import type { Setting } from '../../domain/entities/setting.entity';
import type { SettingRepositoryPort } from '../../application/ports/setting.repository.port';

@Injectable()
export class SettingRepository implements SettingRepositoryPort {
  findById(_id: string): Promise<Setting | null> {
    return Promise.resolve(null);
  }
}
