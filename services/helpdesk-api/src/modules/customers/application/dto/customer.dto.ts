export interface CreateCustomerDto {
  name: string;
  email?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string | null;
}

export interface CustomerResponseDto {
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}
