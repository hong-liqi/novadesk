import { TicketDetailView } from '@/features/tickets';

interface TicketDetailPageProps {
  params: { id: string };
}

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  return <TicketDetailView ticketId={params.id} />;
}
