import { redirect } from 'next/navigation';
import { routes } from '@/shared/lib/routes';

export default function HomePage() {
  redirect(routes.dashboard);
}
