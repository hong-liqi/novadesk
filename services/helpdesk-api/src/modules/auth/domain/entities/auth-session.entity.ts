/**
 * Domain entity — AuthSession
 * Business rules are not implemented at this stage.
 */
export interface AuthSessionProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthSession {
  constructor(readonly props: AuthSessionProps) {}
}
