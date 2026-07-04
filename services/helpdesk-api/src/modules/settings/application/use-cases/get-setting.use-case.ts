import { Inject, Injectable } from '@nestjs/common';
import type { Setting } from '../../domain/entities/setting.entity';
import { SETTING_REPOSITORY, type SettingRepositoryPort } from '../ports/setting.repository.port';

@Injectable()
export class GetSettingUseCase {
  constructor(
    @Inject(SETTING_REPOSITORY)
    private readonly repository: SettingRepositoryPort,
  ) {}

  execute(id: string): Promise<Setting | null> {
    return this.repository.findById(id);
  }
}
