import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginValues } from '@/lib/schemas';
import { Input, Button } from '@/components/ui';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-page p-4 dark:bg-secondary-900">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <span className="flex h-9 items-center rounded-pill border border-gray-150 bg-gray-100 px-5 dark:border-secondary-600 dark:bg-secondary-700">
            <span className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
              AssetOps
            </span>
          </span>
        </div>

        <div className="rounded-3xl bg-gray-25 p-6 shadow-shell dark:bg-secondary-800/95 dark:shadow-none md:p-8">
          <h1 className="mb-1 text-xl font-medium text-secondary-900 dark:text-secondary-50">
            Sign in
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials to continue
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-danger-light p-3 text-sm text-danger-dark dark:bg-danger-dark/20 dark:text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              error={errors.password?.message}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
