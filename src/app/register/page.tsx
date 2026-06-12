'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const registerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
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
      {/* Background orbs */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent 70%)',
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
              background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '1.5rem',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
            }}
          >
            ✨
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Join us and start managing your products
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="John Doe"
              autoComplete="name"
              {...register('name')}
            />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

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
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
