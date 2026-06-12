'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to avoid Server-Side Rendering (SSR) issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner spinner-dark spinner-lg" />
    </div>
  ),
});

export default function DocsPage() {
  useEffect(() => {
    // Suppress legacy lifecycle warnings from the third-party swagger-ui-react package
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0] &&
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') || args[0].includes('componentWillReceiveProps'))
      ) {
        return;
      }
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '24px 12px' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          padding: '16px',
        }}
      >
        <SwaggerUI url="/api/v1/docs" />
      </div>
    </div>
  );
}
