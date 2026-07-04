/**
 * Domain entity — Notification
 * Business rules are not implemented at this stage.
 */
export interface NotificationProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Notification {
  constructor(readonly props: NotificationProps) {}
}
