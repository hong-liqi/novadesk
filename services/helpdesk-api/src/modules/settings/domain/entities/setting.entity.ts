/**
 * Domain entity — Setting
 * Business rules are not implemented at this stage.
 */
export interface SettingProps {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Setting {
  constructor(readonly props: SettingProps) {}
}
