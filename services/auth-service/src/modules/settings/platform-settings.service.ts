import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@infrastructure/database/prisma.service';

export const CONTACT_EMAIL_SETTING_KEY = 'contact_email';

@Injectable()
export class PlatformSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getContactEmail(): Promise<string | null> {
    const stored = await this.prisma.platformSetting.findUnique({
      where: { key: CONTACT_EMAIL_SETTING_KEY },
    });

    if (stored?.value.trim()) {
      return stored.value.trim();
    }

    const fallback = this.configService.get<string>('DEFAULT_CONTACT_EMAIL')?.trim();
    return fallback || null;
  }

  async setContactEmail(contactEmail: string): Promise<string> {
    const normalized = contactEmail.trim().toLowerCase();
    await this.prisma.platformSetting.upsert({
      where: { key: CONTACT_EMAIL_SETTING_KEY },
      create: {
        key: CONTACT_EMAIL_SETTING_KEY,
        value: normalized,
      },
      update: {
        value: normalized,
      },
    });

    return normalized;
  }
}
