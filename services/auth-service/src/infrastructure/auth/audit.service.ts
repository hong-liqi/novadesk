import { Injectable } from '@nestjs/common';
import { Prisma } from '@generated/prisma';
import { PrismaService } from '@infrastructure/database/prisma.service';

export interface AuditContext {
  userId?: string;
  tenantId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    action: string,
    entityType: string,
    entityId: string | undefined,
    context: AuditContext = {},
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId: context.userId,
        tenantId: context.tenantId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        metadata: (context.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
