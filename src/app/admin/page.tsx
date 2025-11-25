import { Metadata } from 'next';
import AdminClient from './admin-client';

export const metadata: Metadata = {
  title: 'Settings - TaskFlow',
  description: 'TaskFlow settings and tech stack information',
};

export default function AdminPage() {
  return <AdminClient />;
}
