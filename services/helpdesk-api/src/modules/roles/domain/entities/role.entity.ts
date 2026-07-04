/**
 * Domain entity — Role
 * Business rules are not implemented at this stage.
 */
export interface RoleProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Role {
  constructor(readonly props: RoleProps) {}
}
