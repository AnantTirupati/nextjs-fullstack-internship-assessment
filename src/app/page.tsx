'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 72px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
        }}
      >
        {/* Gradient background orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
          className="animate-float"
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12), transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
          className="animate-float"
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '20%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            maxWidth: '900px',
            textAlign: 'center',
            zIndex: 1,
          }}
          className="animate-fade-in-up"
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '100px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--color-primary)',
              marginBottom: '32px',
            }}
          >
            <span style={{ fontSize: '0.75rem' }}>🚀</span>
            Full-Stack Assessment Project
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
              marginBottom: '24px',
            }}
          >
            Build. Scale.{' '}
            <span className="gradient-text">Deploy.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              maxWidth: '640px',
              margin: '0 auto 48px',
              lineHeight: '1.7',
            }}
          >
            A production-ready platform powered by Next.js 15, MongoDB, JWT authentication,
            role-based access control, and comprehensive product management.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard →
                </Link>
                <Link href="/products" className="btn btn-secondary btn-lg">
                  Browse Products
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" className="btn btn-primary btn-lg">
                  Get Started Free →
                </Link>
                <Link href="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: '100px 24px',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }} className="animate-fade-in-up">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Everything You Need
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
              Built with industry best practices for scalability, security, and developer experience.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                icon: '🔐',
                title: 'JWT Authentication',
                desc: 'Secure login & registration with bcrypt hashing, access tokens, refresh token rotation, and protected routes.',
                color: '#6366f1',
              },
              {
                icon: '🛡️',
                title: 'Role-Based Access',
                desc: 'Admin and user roles with middleware-based authorization. Only admins can manage products.',
                color: '#ec4899',
              },
              {
                icon: '📦',
                title: 'Product Management',
                desc: 'Full CRUD with pagination, search, sorting, and filtering. Zod-validated inputs throughout.',
                color: '#06b6d4',
              },
              {
                icon: '🚀',
                title: 'API Versioning',
                desc: 'All routes use /api/v1/ prefix with clean architecture designed for future v2 migration.',
                color: '#10b981',
              },
              {
                icon: '📖',
                title: 'API Documentation',
                desc: 'Complete Swagger/OpenAPI spec and Postman collection with environment variables and examples.',
                color: '#f59e0b',
              },
              {
                icon: '⚡',
                title: 'Production Ready',
                desc: 'Rate limiting, error handling, input sanitization, Docker support, and Vercel deployment.',
                color: '#ef4444',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card animate-fade-in-up"
                style={{
                  padding: '32px',
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '20px',
                  }}
                >
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '40px' }}>
            Tech Stack
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {[
              'Next.js 15', 'TypeScript', 'MongoDB', 'Mongoose', 'Tailwind CSS',
              'JWT', 'bcryptjs', 'Zod', 'Axios', 'React Hook Form',
              'Swagger', 'Docker', 'Vercel',
            ].map((tech, i) => (
              <span
                key={i}
                style={{
                  padding: '10px 20px',
                  borderRadius: '100px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '32px 24px',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
        }}
      >
        <p>Built with ❤️ for the PrimeTradeAI Platform</p>
      </footer>
    </div>
  );
}
