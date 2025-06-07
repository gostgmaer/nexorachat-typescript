import { ForgotPasswordForm } from '@/components/pages/auth/forgot-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | NextAuth',
  description: 'Reset your password'
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto py-10 md:py-20">
      <div className="mx-auto max-w-md space-y-6 bg-card p-8 rounded-lg shadow-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}