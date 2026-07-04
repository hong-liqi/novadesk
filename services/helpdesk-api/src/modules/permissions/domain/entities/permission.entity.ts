/**
 * Domain entity — Permission
 * Business rules are not implemented at this stage.
 */
export interface PermissionProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Permission {
  constructor(readonly props: PermissionProps) {}
}
