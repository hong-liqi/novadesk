export interface SendEmailDto {
  to: string;
  subject: string;
  body?: string;
  html?: string;
}

export interface EmailLogResponse {
  id: string;
  to: string;
  subject: string;
  body: string | null;
  status: 'PENDING' | 'SENT' | 'FAILED';
  error: string | null;
  messageId: string | null;
  sentAt: string | null;
  createdAt: string;
}
