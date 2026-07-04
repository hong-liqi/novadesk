/**
 * Domain entity — Channel
 * Business rules are not implemented at this stage.
 */
export interface ChannelProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Channel {
  constructor(readonly props: ChannelProps) {}
}
