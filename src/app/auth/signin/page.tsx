import { LoginForm } from '@/components/pages/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | NextAuth',
  description: 'Sign in to your account'
};

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10 md:py-20">
      <div className="mx-auto max-w-md space-y-6 bg-card p-8 rounded-lg shadow-md">
        <LoginForm />
      </div>
    </div>
  );
}