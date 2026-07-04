export interface ChatMessageResponse {
  id: string;
  ticketId: string;
  userId: string;
  body: string;
  createdAt: string;
}

export interface JoinPayload {
  ticketId: string;
}

export interface MessagePayload {
  ticketId: string;
  body: string;
}

export interface TypingPayload {
  ticketId: string;
  isTyping: boolean;
}

export interface PresencePayload {
  ticketId: string;
  userId: string;
  online: boolean;
}

export function roomName(ticketId: string): string {
  return `ticket:${ticketId}`;
}
