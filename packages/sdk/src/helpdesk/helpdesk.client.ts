import type { Workspace } from '@novadesk/shared';
import type { NovaDeskClient } from '../client';

export interface DashboardSummary {
  openTickets: number;
  pendingTickets: number;
  resolvedToday: number;
  closedTickets: number;
  totalCustomers: number;
  totalTickets: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HelpdeskTicket {
  id: string;
  workspaceId: string;
  subject: string;
  status: string;
  priority: string;
  customerId: string | null;
  contactId?: string | null;
  assigneeId: string | null;
  teamId?: string | null;
  channelId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HelpdeskMessage {
  id: string;
  ticketId: string;
  authorId: string | null;
  body: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface HelpdeskCustomer {
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListTicketsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface ListCustomersParams {
  page?: number;
  pageSize?: number;
}

export interface CreateTicketInput {
  subject: string;
  customerId?: string;
  priority?: string;
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string | null;
}

export class HelpdeskClient {
  constructor(private readonly client: NovaDeskClient) {}

  listWorkspaces(): Promise<Workspace[]> {
    return this.client.get<Workspace[]>('/helpdesk/workspaces').then((response) => response.data);
  }

  getWorkspace(id: string): Promise<Workspace> {
    return this.client
      .get<Workspace>(`/helpdesk/workspaces/${id}`)
      .then((response) => response.data);
  }

  listTickets(params: ListTicketsParams = {}): Promise<PaginatedResult<HelpdeskTicket>> {
    return this.client
      .get<PaginatedResult<HelpdeskTicket>>('/helpdesk/tickets', {
        params: {
          status: params.status,
          page: params.page,
          limit: params.limit,
        },
      })
      .then((response) => response.data);
  }

  getTicket(id: string): Promise<HelpdeskTicket> {
    return this.client
      .get<HelpdeskTicket>(`/helpdesk/tickets/${id}`)
      .then((response) => response.data);
  }

  createTicket(input: CreateTicketInput): Promise<HelpdeskTicket> {
    return this.client
      .post<HelpdeskTicket>('/helpdesk/tickets', input)
      .then((response) => response.data);
  }

  updateTicketStatus(id: string, status: string): Promise<HelpdeskTicket> {
    return this.client
      .patch<HelpdeskTicket>(`/helpdesk/tickets/${id}/status`, { status })
      .then((response) => response.data);
  }

  listMessages(ticketId: string): Promise<HelpdeskMessage[]> {
    return this.client
      .get<HelpdeskMessage[]>(`/helpdesk/tickets/${ticketId}/messages`)
      .then((response) => response.data);
  }

  createMessage(ticketId: string, body: string): Promise<HelpdeskMessage> {
    return this.client
      .post<HelpdeskMessage>(`/helpdesk/tickets/${ticketId}/messages`, { body })
      .then((response) => response.data);
  }

  listCustomers(): Promise<HelpdeskCustomer[]> {
    return this.client
      .get<HelpdeskCustomer[]>('/helpdesk/customers')
      .then((response) => response.data);
  }

  getCustomer(id: string): Promise<HelpdeskCustomer> {
    return this.client
      .get<HelpdeskCustomer>(`/helpdesk/customers/${id}`)
      .then((response) => response.data);
  }

  createCustomer(input: CreateCustomerInput): Promise<HelpdeskCustomer> {
    return this.client
      .post<HelpdeskCustomer>('/helpdesk/customers', input)
      .then((response) => response.data);
  }

  updateCustomer(id: string, input: UpdateCustomerInput): Promise<HelpdeskCustomer> {
    return this.client
      .patch<HelpdeskCustomer>(`/helpdesk/customers/${id}`, input)
      .then((response) => response.data);
  }

  deleteCustomer(id: string): Promise<{ success: true }> {
    return this.client
      .delete<{ success: true }>(`/helpdesk/customers/${id}`)
      .then((response) => response.data);
  }

  getDashboard(): Promise<DashboardSummary> {
    return this.client
      .get<DashboardSummary>('/helpdesk/dashboard/stats')
      .then((response) => response.data);
  }
}

export function createHelpdeskClient(client: NovaDeskClient): HelpdeskClient {
  return new HelpdeskClient(client);
}
