/**
 * Domain entity — Team
 * Business rules are not implemented at this stage.
 */
export interface TeamProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Team {
  constructor(readonly props: TeamProps) {}
}
