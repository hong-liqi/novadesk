/**
 * Domain entity — AuditLog
 * Business rules are not implemented at this stage.
 */
export interface AuditLogProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuditLog {
  constructor(readonly props: AuditLogProps) {}
}
