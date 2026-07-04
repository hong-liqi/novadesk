/**
 * Domain entity — Analytics
 * Business rules are not implemented at this stage.
 */
export interface AnalyticsProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Analytics {
  constructor(readonly props: AnalyticsProps) {}
}
