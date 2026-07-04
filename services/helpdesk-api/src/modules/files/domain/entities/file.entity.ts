/**
 * Domain entity — File
 * Business rules are not implemented at this stage.
 */
export interface FileProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class File {
  constructor(readonly props: FileProps) {}
}
