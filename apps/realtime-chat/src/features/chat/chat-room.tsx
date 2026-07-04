'use client';

import { useAuth } from '@novadesk/auth/client';
import { Button } from '@novadesk/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { fetchChatHistory, getGatewayOrigin, type ChatMessage } from '@/shared/services/api-client';

export function ChatRoom() {
  const { accessToken, user, isAuthenticated, isLoading } = useAuth();
  const [ticketId, setTicketId] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setStatus('idle');
  }, []);

  const joinRoom = useCallback(
    async (roomTicketId: string) => {
      if (!accessToken) {
        return;
      }

      disconnectSocket();
      setStatus('connecting');
      setMessages([]);
      setTypingUsers(new Set());
      setActiveTicketId(roomTicketId);

      try {
        const history = await fetchChatHistory(roomTicketId);
        setMessages(history);
      } catch {
        setStatus('error');
        return;
      }

      const socket = io(getGatewayOrigin(), {
        path: '/socket.io',
        auth: { token: accessToken },
        transports: ['websocket', 'polling'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setStatus('connected');
        socket.emit('join', { ticketId: roomTicketId });
      });

      socket.on('connect_error', () => {
        setStatus('error');
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

      socket.on('presence', (_payload: { userId: string; online: boolean }) => {
        // Presence updates are broadcast; UI can be extended later.
      });
    },
    [accessToken, disconnectSocket],
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
          Authenticate via NovaDesk (auth tokens in local storage) to join a ticket room.
        </p>
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
      </header>

      <form onSubmit={handleJoin} className="flex gap-2">
        <input
          type="text"
          value={ticketId}
          onChange={(event) => {
            setTicketId(event.target.value);
          }}
          placeholder="Ticket room ID (UUID)"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <Button type="submit">Join room</Button>
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
