/**
 * Domain entity — Automation
 * Business rules are not implemented at this stage.
 */
export interface AutomationProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Automation {
  constructor(readonly props: AutomationProps) {}
}
