/**
 * Domain entity — AiContext
 * Business rules are not implemented at this stage.
 */
export interface AiContextProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AiContext {
  constructor(readonly props: AiContextProps) {}
}
