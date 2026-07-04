export interface KpisResponseDto {
  workspaceId: string;
  open: number;
  resolved: number;
  avgResolutionTimeHours: number;
}

export interface TrendPointDto {
  date: string;
  openCount: number;
  createdCount: number;
  resolvedCount: number;
}

export interface TrendsResponseDto {
  workspaceId: string;
  days: number;
  points: TrendPointDto[];
}
