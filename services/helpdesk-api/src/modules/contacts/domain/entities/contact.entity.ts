export interface ContactEntity {
  id: string;
  customerId: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}
