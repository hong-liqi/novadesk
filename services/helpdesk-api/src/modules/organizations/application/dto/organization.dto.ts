export interface CreateOrganizationDto {
  name: string;
  slug: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  slug?: string;
}

export interface OrganizationResponseDto {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
