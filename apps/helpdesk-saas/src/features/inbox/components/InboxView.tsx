'use client';

import { TicketsListView } from '@/features/tickets';

export function InboxView() {
  return (
    <TicketsListView
      statusFilter="PENDING"
      title="Inbox"
      description="Pending tickets requiring attention"
    />
  );
}
