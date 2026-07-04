/**
 * Domain entity — KnowledgeArticle
 * Business rules are not implemented at this stage.
 */
export interface KnowledgeArticleProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class KnowledgeArticle {
  constructor(readonly props: KnowledgeArticleProps) {}
}
