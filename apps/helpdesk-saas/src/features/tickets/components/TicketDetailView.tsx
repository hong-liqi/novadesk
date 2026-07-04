'use client';

import type { HelpdeskMessage, HelpdeskTicket } from '@portfolio/sdk';
import { Badge, Button, Stack } from '@portfolio/ui';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { routes } from '@/shared/lib/routes';
import { ticketStatusLabel, ticketStatusVariant } from '@/shared/lib/ticket-status';
import { helpdeskClient } from '@/shared/services';
import { useWorkspace } from '@/shared/hooks/use-workspace';

const STATUS_OPTIONS = ['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'] as const;

interface TicketDetailViewProps {
  ticketId: string;
}

export function TicketDetailView({ ticketId }: TicketDetailViewProps) {
  const { workspaceId, isLoading: workspaceLoading } = useWorkspace();
  const [ticket, setTicket] = useState<HelpdeskTicket | null>(null);
  const [messages, setMessages] = useState<HelpdeskMessage[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTicket = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [ticketData, messageData] = await Promise.all([
        helpdeskClient.getTicket(ticketId),
        helpdeskClient.listMessages(ticketId),
      ]);
      setTicket(ticketData);
      setMessages(messageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, ticketId]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  async function handleStatusChange(status: string) {
    if (!ticket) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updated = await helpdeskClient.updateTicketStatus(ticket.id, status);
      setTicket(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reply.trim()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const message = await helpdeskClient.createMessage(ticketId, reply.trim());
      setMessages((current) => [...current, message]);
      setReply('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  }

  if (workspaceLoading || loading) {
    return <p className="text-neutral-500">Loading ticket…</p>;
  }

  if (error && !ticket) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!ticket) {
    return <p className="text-neutral-500">Ticket not found.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link href={routes.tickets} className="text-sm text-blue-600 hover:underline">
          ← Back to tickets
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-neutral-900">{ticket.subject}</h1>
          <Badge variant={ticketStatusVariant(ticket.status)}>
            {ticketStatusLabel(ticket.status)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-500">Update status:</span>
        {STATUS_OPTIONS.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={ticket.status === status ? 'primary' : 'secondary'}
            disabled={submitting || ticket.status === status}
            onClick={() => void handleStatusChange(status)}
          >
            {ticketStatusLabel(status)}
          </Button>
        ))}
      </div>

      {error ? <p className="text-red-600">{error}</p> : null}

      <Stack gap="md">
        <h2 className="text-lg font-medium text-neutral-900">Messages</h2>
        <div className="flex flex-col gap-3">
          {messages.length ? (
            messages.map((message) => (
              <div
                key={message.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
              >
                <p className="whitespace-pre-wrap text-neutral-800">{message.body}</p>
                <p className="mt-2 text-xs text-neutral-500">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500">No messages yet.</p>
          )}
        </div>
      </Stack>

      <form onSubmit={(event) => void handleReply(event)} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-neutral-700">Reply</span>
          <textarea
            className="min-h-28 rounded-lg border border-neutral-200 px-3 py-2"
            value={reply}
            onChange={(event) => {
              setReply(event.target.value);
            }}
            placeholder="Write a reply…"
            required
          />
        </label>
        <div>
          <Button type="submit" loading={submitting}>
            Send reply
          </Button>
        </div>
      </form>
    </div>
  );
}
