'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/useProducts';

export default function DashboardPage() {
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const { fetchProducts, pagination } = useProducts();
  const router = useRouter();
  const [stats, setStats] = useState({ totalProducts: 0, categories: 0 });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        await fetchProducts({ limit: 1 });
      } catch {
        // Silently handle
      }
    };
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated, fetchProducts]);

  useEffect(() => {
    if (pagination) {
      setStats((prev) => ({ ...prev, totalProducts: pagination.total }));
    }
  }, [pagination]);

  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner spinner-dark spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '800',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: '4px' }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="page-subtitle">
              {isAdmin ? 'Admin Dashboard — Full control over products and settings' : 'Your personal dashboard overview'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-value" style={{ color: 'var(--color-primary)' }}>{stats.totalProducts}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <div style={{ fontSize: '2rem', opacity: 0.6 }}>📦</div>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-value" style={{ color: 'var(--color-success)' }}>{user?.role}</div>
              <div className="stat-label">Account Role</div>
            </div>
            <div style={{ fontSize: '2rem', opacity: 0.6 }}>{isAdmin ? '👑' : '👤'}</div>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-value" style={{ color: 'var(--color-accent)', fontSize: '1.3rem' }}>{user?.email}</div>
              <div className="stat-label">Email</div>
            </div>
            <div style={{ fontSize: '2rem', opacity: 0.6 }}>📧</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/products" className="btn btn-secondary">
            📦 Browse Products
          </Link>
          {isAdmin && (
            <Link href="/products/new" className="btn btn-primary">
              ➕ Add New Product
            </Link>
          )}
          <Link href="/api/v1/docs" className="btn btn-ghost" target="_blank">
            📖 API Docs
          </Link>
        </div>
      </div>

      {/* User Info Card */}
      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Account Details</h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Role', value: user?.role },
            { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.label}</span>
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
