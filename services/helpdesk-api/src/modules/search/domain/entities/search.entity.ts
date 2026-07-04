/**
 * Domain entity — Search
 * Business rules are not implemented at this stage.
 */
export interface SearchProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Search {
  constructor(readonly props: SearchProps) {}
}
