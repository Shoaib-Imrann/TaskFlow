import { Metadata } from 'next';
import DashboardClient from './dashboard-client';

export const metadata: Metadata = {
  title: 'Dashboard - TaskFlow',
  description: 'Manage your tasks efficiently with TaskFlow dashboard',
  keywords: ['task management', 'productivity', 'dashboard'],
};

export default function DashboardPage() {
  return <DashboardClient />;
}
