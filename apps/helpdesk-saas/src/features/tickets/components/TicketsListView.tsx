'use client';

import type { HelpdeskCustomer, HelpdeskTicket, PaginatedResult } from '@novadesk/sdk';
import {
  Badge,
  Button,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@novadesk/ui';
import { Modal, useDisclosure } from '@novadesk/ui/client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { routes } from '@/shared/lib/routes';
import {
  ticketPriorityVariant,
  ticketStatusLabel,
  ticketStatusVariant,
} from '@/shared/lib/ticket-status';
import { helpdeskClient } from '@/shared/services';
import { useWorkspace } from '@/shared/hooks/use-workspace';

const PAGE_SIZE = 10;

interface TicketsListViewProps {
  statusFilter?: string;
  statusFilters?: string[];
  title?: string;
  description?: string;
  allowCreate?: boolean;
  emptyHint?: string;
}

export function TicketsListView({
  statusFilter,
  statusFilters,
  title = 'Tickets',
  description = 'Manage support requests',
  allowCreate = true,
  emptyHint,
}: TicketsListViewProps) {
  const { workspaceId, isLoading: workspaceLoading } = useWorkspace();
  const createModal = useDisclosure();
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<HelpdeskTicket> | null>(null);
  const [customers, setCustomers] = useState<HelpdeskCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [creating, setCreating] = useState(false);

  const loadTickets = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await helpdeskClient.listTickets({
        page,
        limit: PAGE_SIZE,
        status: statusFilters?.length ? undefined : statusFilter,
        statuses: statusFilters,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, page, statusFilter, statusFilters]);

  const loadCustomers = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    try {
      const data = await helpdeskClient.listCustomers();
      setCustomers(data);
    } catch {
      setCustomers([]);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (!allowCreate) {
      return;
    }

    void loadCustomers();
  }, [allowCreate, loadCustomers]);

  async function handleCreateTicket() {
    if (!subject.trim()) {
      return;
    }

    setCreating(true);
    setError(null);

    try {
      await helpdeskClient.createTicket({
        subject: subject.trim(),
        customerId: customerId || undefined,
      });
      setSubject('');
      setCustomerId('');
      createModal.close();
      setPage(1);
      await loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  }

  if (workspaceLoading || loading) {
    return <p className="text-neutral-500">Loading tickets…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
        {allowCreate ? <Button onClick={createModal.open}>New ticket</Button> : null}
      </div>

      {error ? <p className="text-red-600">{error}</p> : null}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Subject</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Priority</TableHeader>
            <TableHeader>Updated</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {result?.items.length ? (
            result.items.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Link
                    href={routes.ticketDetail(ticket.id)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {ticket.subject}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={ticketStatusVariant(ticket.status)}>
                    {ticketStatusLabel(ticket.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={ticketPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                </TableCell>
                <TableCell>{new Date(ticket.updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>{emptyHint ?? 'No tickets found.'}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {result && result.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Page {result.page} of {result.totalPages} ({result.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                setPage((current) => current - 1);
              }}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= result.totalPages}
              onClick={() => {
                setPage((current) => current + 1);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {allowCreate ? (
        <Modal
          isOpen={createModal.isOpen}
          onClose={createModal.close}
          title="Create ticket"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={createModal.close}>
                Cancel
              </Button>
              <Button loading={creating} onClick={() => void handleCreateTicket()}>
                Create
              </Button>
            </div>
          }
        >
          <Stack gap="md">
            <Input
              label="Subject"
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
              }}
              required
            />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-neutral-700">Customer (optional)</span>
              <select
                className="rounded-lg border border-neutral-200 px-3 py-2"
                value={customerId}
                onChange={(event) => {
                  setCustomerId(event.target.value);
                }}
              >
                <option value="">None</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
          </Stack>
        </Modal>
      ) : null}
    </div>
  );
}
