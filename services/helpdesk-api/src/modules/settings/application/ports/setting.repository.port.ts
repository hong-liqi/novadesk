import type { Setting } from '../../domain/entities/setting.entity';

export const SETTING_REPOSITORY = Symbol('SETTING_REPOSITORY');

export interface SettingRepositoryPort {
  findById(id: string): Promise<Setting | null>;
}
