'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/context/ToastContext';
import type { QueryParams } from '@/types/api';

export default function ProductsPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const { products, pagination, isLoading, fetchProducts, deleteProduct } = useProducts();
  const toast = useToast();
  const router = useRouter();

  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    limit: 9,
    search: '',
    sort: 'createdAt',
    order: 'desc',
    category: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = useCallback(() => {
    const cleanQuery = { ...query };
    if (!cleanQuery.search) delete cleanQuery.search;
    if (!cleanQuery.category) delete cleanQuery.category;
    fetchProducts(cleanQuery);
  }, [query, fetchProducts]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      loadProducts();
    }
  }, [authLoading, isAuthenticated, router, loadProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery((prev) => ({ ...prev, page: 1, search: searchInput }));
  };

  const handleDelete = async () => {
    if (!deleteModalId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteModalId);
      toast.success('Product deleted successfully');
      setDeleteModalId(null);
      loadProducts();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

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
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">
            {pagination ? `${pagination.total} products found` : 'Browse and manage products'}
          </p>
        </div>
        {isAdmin && (
          <Link href="/products/new" className="btn btn-primary">
            ➕ Add Product
          </Link>
        )}
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: '1 1 300px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <select
          className="form-input"
          value={query.sort}
          onChange={(e) => setQuery((prev) => ({ ...prev, sort: e.target.value, page: 1 }))}
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="title">Title</option>
          <option value="stock">Stock</option>
        </select>

        <select
          className="form-input"
          value={query.order}
          onChange={(e) => setQuery((prev) => ({ ...prev, order: e.target.value as 'asc' | 'desc', page: 1 }))}
          style={{ width: 'auto', minWidth: '120px' }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        {(query.search || query.category) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSearchInput('');
              setQuery((prev) => ({ ...prev, search: '', category: '', page: 1 }));
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card" style={{ padding: '24px' }}>
              <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '8px' }} />
              <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '16px' }} />
              <div className="skeleton" style={{ height: '32px', width: '40%' }} />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-title">No products found</div>
          <div className="empty-state-desc">
            {query.search
              ? 'Try adjusting your search terms or filters'
              : isAdmin
              ? 'Get started by adding your first product'
              : 'No products have been added yet'}
          </div>
          {isAdmin && !query.search && (
            <Link href="/products/new" className="btn btn-primary" style={{ marginTop: '24px' }}>
              ➕ Add First Product
            </Link>
          )}
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {products.map((product, i) => (
              <div
                key={product._id}
                className="card animate-fade-in-up"
                style={{
                  padding: '28px',
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: 'both',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-primary">{product.category}</span>
                  <span
                    className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px', lineHeight: '1.3' }}>
                  {product.title}
                </h3>

                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    marginBottom: '16px',
                    flex: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                    ${product.price.toFixed(2)}
                  </span>

                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        href={`/products/${product._id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteModalId(product._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination" style={{ marginTop: '32px' }}>
              <button
                className="pagination-btn"
                disabled={!pagination.hasPrev}
                onClick={() => setQuery((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
              >
                ‹
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                let pageNum: number;
                const total = pagination.totalPages;
                const current = pagination.page;

                if (total <= 7) {
                  pageNum = i + 1;
                } else if (current <= 4) {
                  pageNum = i + 1;
                } else if (current >= total - 3) {
                  pageNum = total - 6 + i;
                } else {
                  pageNum = current - 3 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${pageNum === current ? 'active' : ''}`}
                    onClick={() => setQuery((prev) => ({ ...prev, page: pageNum }))}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="pagination-btn"
                disabled={!pagination.hasNext}
                onClick={() => setQuery((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {deleteModalId && (
        <div className="modal-overlay" onClick={() => !isDeleting && setDeleteModalId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Product</h3>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setDeleteModalId(null)}
                disabled={isDeleting}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteModalId(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner" />
                    Deleting...
                  </>
                ) : (
                  'Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
