import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EmailLog } from '@generated/prisma';
import { PrismaService } from '@infrastructure/database/prisma.service';
import nodemailer from 'nodemailer';
import type { EmailLogResponse, SendEmailDto } from './application/dto/email.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async send(dto: SendEmailDto): Promise<EmailLogResponse> {
    const log = await this.prisma.emailLog.create({
      data: {
        to: dto.to,
        subject: dto.subject,
        body: dto.html ?? dto.body,
        status: 'PENDING',
      },
    });

    try {
      const host = this.configService.get<string>('SMTP_HOST', 'localhost');
      const port = this.configService.get<number>('SMTP_PORT', 1025);
      const user = this.configService.get<string>('SMTP_USER');
      const pass = this.configService.get<string>('SMTP_PASSWORD');

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        requireTLS: port === 587,
        auth: user && pass ? { user, pass } : undefined,
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      });

      const result = await transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM', 'noreply@novadesk.dev'),
        to: dto.to,
        subject: dto.subject,
        text: dto.body,
        html: dto.html ?? dto.body,
      });

      const updated = await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: 'SENT',
          messageId: result.messageId,
          sentAt: new Date(),
        },
      });

      return mapEmailLog(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown email delivery error';

      await this.prisma.emailLog.update({
        where: { id: log.id },
        data: {
          status: 'FAILED',
          error: message,
        },
      });

      throw new InternalServerErrorException(`Failed to send email: ${message}`);
    }
  }
}

function mapEmailLog(log: EmailLog): EmailLogResponse {
  return {
    id: log.id,
    to: log.to,
    subject: log.subject,
    body: log.body,
    status: log.status,
    error: log.error,
    messageId: log.messageId,
    sentAt: log.sentAt?.toISOString() ?? null,
    createdAt: log.createdAt.toISOString(),
  };
}
