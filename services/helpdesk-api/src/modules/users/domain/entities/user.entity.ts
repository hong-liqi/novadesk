/**
 * Domain entity — User
 * Business rules are not implemented at this stage.
 */
export interface UserProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(readonly props: UserProps) {}
}
