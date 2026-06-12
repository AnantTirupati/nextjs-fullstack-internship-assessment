'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
      }}
    >
      {/* Background orb */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="card animate-fade-in-up"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '48px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '1.5rem',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            }}
          >
            🔑
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
