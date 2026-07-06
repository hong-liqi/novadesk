'use client';

import { useAuth } from '@novadesk/auth/client';
import type { HelpdeskTicket } from '@novadesk/sdk';
import { Button } from '@novadesk/ui';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import {
  fetchChatHistory,
  getGatewayOrigin,
  isTicketUuid,
  loadOpenTickets,
  tokenManager,
  type ChatMessage,
} from '@/shared/services/api-client';
import { routes } from '@/shared/lib/routes';

export function ChatRoom() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [ticketId, setTicketId] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [openTickets, setOpenTickets] = useState<HelpdeskTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setTicketsLoading(true);
    void loadOpenTickets()
      .then(setOpenTickets)
      .catch(() => {
        setOpenTickets([]);
      })
      .finally(() => {
        setTicketsLoading(false);
      });
  }, [isAuthenticated]);

  const joinRoom = useCallback(
    async (roomTicketId: string) => {
      const token = await tokenManager.ensureAccessToken();
      if (!token) {
        setStatus('error');
        setErrorMessage('Session expired. Sign out and sign in again.');
        return;
      }

      const trimmed = roomTicketId.trim();
      if (!isTicketUuid(trimmed)) {
        setErrorMessage('Use the ticket UUID from HelpDesk (not the subject or customer name).');
        setStatus('error');
        return;
      }

      disconnectSocket();
      setStatus('connecting');
      setErrorMessage(null);
      setMessages([]);
      setTypingUsers(new Set());
      setActiveTicketId(trimmed);

      try {
        const history = await fetchChatHistory(trimmed);
        setMessages(history);
      } catch {
        setStatus('error');
        setErrorMessage('Could not load this ticket room. Confirm the ticket exists in HelpDesk.');
        return;
      }

      const socket = io(getGatewayOrigin(), {
        path: '/socket.io',
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setStatus('connected');
        setErrorMessage(null);
        socket.emit('join', { ticketId: trimmed });
      });

      socket.on('connect_error', () => {
        setStatus('error');
        setErrorMessage(
          'WebSocket connection failed. Check gateway WebSocket support and CORS for the chat app.',
        );
      });

      socket.on('message', (message: ChatMessage) => {
        setMessages((current) => [...current, message]);
      });

      socket.on('typing', (payload: { userId: string; isTyping: boolean }) => {
        setTypingUsers((current) => {
          const next = new Set(current);
          if (payload.isTyping) {
            next.add(payload.userId);
          } else {
            next.delete(payload.userId);
          }
          return next;
        });
      });
    },
    [disconnectSocket],
  );

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  const handleJoin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = ticketId.trim();
    if (!trimmed) {
      return;
    }
    void joinRoom(trimmed);
  };

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !activeTicketId || !socketRef.current) {
      return;
    }

    socketRef.current.emit('message', { ticketId: activeTicketId, body: trimmed });
    setDraft('');
    socketRef.current.emit('typing', { ticketId: activeTicketId, isTyping: false });
  };

  const handleDraftChange = (value: string) => {
    setDraft(value);

    if (!activeTicketId || !socketRef.current) {
      return;
    }

    socketRef.current.emit('typing', { ticketId: activeTicketId, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing', { ticketId: activeTicketId, isTyping: false });
    }, 1500);
  };

  if (isLoading) {
    return <p className="text-slate-600">Loading session…</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium">Sign in required</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in or create a NovaDesk account to join ticket chat rooms.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={routes.login}>
            <Button variant="primary">Sign in</Button>
          </Link>
          <Link href={routes.register}>
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Ticket Chat</h1>
        <p className="text-sm text-slate-600">
          Signed in as {user?.email ?? user?.id}. Status: {status}
        </p>
        {errorMessage ? <p className="mt-2 text-sm text-red-600">{errorMessage}</p> : null}
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-slate-700">Open tickets from HelpDesk</h2>
        {ticketsLoading ? <p className="mt-2 text-sm text-slate-500">Loading tickets…</p> : null}
        {!ticketsLoading && openTickets.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No open tickets found. Create one in HelpDesk first.
          </p>
        ) : null}
        {openTickets.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {openTickets.map((ticket) => (
              <li key={ticket.id}>
                <button
                  type="button"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    setTicketId(ticket.id);
                    void joinRoom(ticket.id);
                  }}
                >
                  <span className="font-medium">{ticket.subject}</span>
                  <span className="ml-2 text-xs text-slate-500">{ticket.id}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <form onSubmit={handleJoin} className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="ticket-id">
          Or paste a ticket UUID
        </label>
        <div className="flex gap-2">
          <input
            id="ticket-id"
            type="text"
            value={ticketId}
            onChange={(event) => {
              setTicketId(event.target.value);
            }}
            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <Button type="submit">Join room</Button>
        </div>
      </form>

      {activeTicketId ? (
        <section className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-medium text-slate-700">Room: ticket:{activeTicketId}</h2>

          <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {messages.length === 0 ? (
              <li className="text-sm text-slate-500">No messages yet.</li>
            ) : (
              messages.map((message) => (
                <li key={message.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-medium">{message.userId.slice(0, 8)}</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span>{message.body}</span>
                </li>
              ))
            )}
          </ul>

          {typingUsers.size > 0 ? (
            <p className="text-xs text-slate-500">{typingUsers.size} user(s) typing…</p>
          ) : null}

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(event) => {
                handleDraftChange(event.target.value);
              }}
              placeholder="Type a message"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
              disabled={status !== 'connected'}
            />
            <Button type="submit" disabled={status !== 'connected'}>
              Send
            </Button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
