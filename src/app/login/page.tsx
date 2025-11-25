import { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
  title: 'Login - TaskFlow',
  description: 'Sign in to TaskFlow to manage your tasks efficiently',
};

export default function LoginPage() {
  return <LoginClient />;
}
