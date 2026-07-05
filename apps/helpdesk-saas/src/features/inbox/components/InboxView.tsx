'use client';

import { TicketsListView } from '@/features/tickets';

export function InboxView() {
  return (
    <TicketsListView
      statusFilters={['OPEN', 'PENDING']}
      title="Inbox"
      description="Open tickets requiring attention"
      allowCreate={false}
      emptyHint="No open tickets. Create new tickets from the Tickets page."
    />
  );
}
