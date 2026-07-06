import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, Roles } from '@novadesk/auth';
import { ROLES } from '@novadesk/shared';
import { z } from 'zod';
import { PlatformSettingsService } from './platform-settings.service';

const updateContactEmailSchema = z.object({
  contactEmail: z.string().email(),
});

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly platformSettings: PlatformSettingsService) {}

  @Get('contact-email')
  @Public()
  @ApiOperation({ summary: 'Get the public contact form destination email' })
  async getContactEmail(): Promise<{ contactEmail: string | null }> {
    return { contactEmail: await this.platformSettings.getContactEmail() };
  }

  @Patch('contact-email')
  @Roles(ROLES.SUPER_ADMIN, ROLES.ADMIN)
  @ApiOperation({ summary: 'Update the contact form destination email' })
  async updateContactEmail(@Body() body: unknown): Promise<{ contactEmail: string }> {
    const dto = updateContactEmailSchema.parse(body);
    const contactEmail = await this.platformSettings.setContactEmail(dto.contactEmail);
    return { contactEmail };
  }
}
