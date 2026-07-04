import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { EmailLogResponse, SendEmailDto } from '../../application/dto/email.dto';
import { EmailService } from '../../email.service';

@ApiTags('notifications')
@Controller('notifications')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a transactional email (internal)' })
  send(@Body() dto: SendEmailDto): Promise<EmailLogResponse> {
    return this.emailService.send(dto);
  }
}
