import { ConfigService } from '@nestjs/config';
import type { EmailLog } from '@generated/prisma';
import { PrismaService } from '@infrastructure/database/prisma.service';
import nodemailer from 'nodemailer';
import { EmailService } from './email.service';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('EmailService', () => {
  let service: EmailService;
  let prisma: {
    emailLog: {
      create: jest.Mock;
      update: jest.Mock;
    };
  };
  let sendMail: jest.Mock;

  beforeEach(() => {
    sendMail = jest.fn().mockResolvedValue({ messageId: 'msg-123' });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });

    prisma = {
      emailLog: {
        create: jest.fn().mockResolvedValue({
          id: 'log-1',
          to: 'user@example.com',
          subject: 'Hello',
          body: 'Welcome',
          status: 'PENDING',
          error: null,
          messageId: null,
          sentAt: null,
          createdAt: new Date('2026-07-03T00:00:00.000Z'),
        } satisfies EmailLog),
        update: jest.fn().mockResolvedValue({
          id: 'log-1',
          to: 'user@example.com',
          subject: 'Hello',
          body: 'Welcome',
          status: 'SENT',
          error: null,
          messageId: 'msg-123',
          sentAt: new Date('2026-07-03T00:00:01.000Z'),
          createdAt: new Date('2026-07-03T00:00:00.000Z'),
        } satisfies EmailLog),
      },
    };

    const configService = {
      get: jest.fn((key: string, fallback?: string | number) => {
        const values: Record<string, string | number> = {
          SMTP_HOST: 'localhost',
          SMTP_PORT: 1025,
          SMTP_FROM: 'noreply@novadesk.dev',
        };
        return values[key] ?? fallback;
      }),
    } as unknown as ConfigService;

    service = new EmailService(configService, prisma as unknown as PrismaService);
  });

  it('sends email via SMTP and records delivery as SENT', async () => {
    const result = await service.send({
      to: 'user@example.com',
      subject: 'Hello',
      body: 'Welcome',
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'localhost',
      port: 1025,
      secure: false,
      requireTLS: false,
      auth: undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
    expect(sendMail).toHaveBeenCalledWith({
      from: 'noreply@novadesk.dev',
      to: 'user@example.com',
      subject: 'Hello',
      text: 'Welcome',
      html: 'Welcome',
    });
    expect(prisma.emailLog.create).toHaveBeenCalled();
    expect(prisma.emailLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'SENT',
          messageId: 'msg-123',
        }),
      }),
    );
    expect(result.status).toBe('SENT');
    expect(result.messageId).toBe('msg-123');
  });

  it('uses SMTP auth and STARTTLS on port 587 when credentials are configured', async () => {
    const configService = {
      get: jest.fn((key: string, fallback?: string | number) => {
        const values: Record<string, string | number> = {
          SMTP_HOST: 'smtp.example.com',
          SMTP_PORT: 587,
          SMTP_FROM: 'noreply@example.com',
          SMTP_USER: 'noreply@example.com',
          SMTP_PASSWORD: 'secret',
        };
        return values[key] ?? fallback;
      }),
    } as unknown as ConfigService;

    const authenticatedService = new EmailService(
      configService,
      prisma as unknown as PrismaService,
    );

    await authenticatedService.send({
      to: 'user@example.com',
      subject: 'Hello',
      body: 'Welcome',
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: { user: 'noreply@example.com', pass: 'secret' },
      }),
    );
  });

  it('marks email log as FAILED when SMTP send fails', async () => {
    sendMail.mockRejectedValueOnce(new Error('SMTP connection refused'));

    await expect(
      service.send({
        to: 'user@example.com',
        subject: 'Hello',
        body: 'Welcome',
      }),
    ).rejects.toThrow('Failed to send email: SMTP connection refused');

    expect(prisma.emailLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'FAILED',
          error: 'SMTP connection refused',
        }),
      }),
    );
  });
});
