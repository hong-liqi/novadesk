export interface CreateContactDto {
  name: string;
  email?: string;
  phone?: string;
}

export interface UpdateContactDto {
  name?: string;
  email?: string | null;
  phone?: string | null;
}

export interface ContactResponseDto {
  id: string;
  customerId: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}
