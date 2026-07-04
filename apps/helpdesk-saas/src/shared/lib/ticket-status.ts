import type { BadgeVariant } from '@portfolio/ui';

export function ticketStatusLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function ticketStatusVariant(status: string): BadgeVariant {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return 'accent';
    case 'PENDING':
      return 'warning';
    case 'RESOLVED':
      return 'success';
    case 'CLOSED':
      return 'default';
    default:
      return 'default';
  }
}

export function ticketPriorityVariant(priority: string): BadgeVariant {
  switch (priority.toUpperCase()) {
    case 'URGENT':
      return 'danger';
    case 'HIGH':
      return 'warning';
    case 'MEDIUM':
      return 'accent';
    default:
      return 'default';
  }
}
