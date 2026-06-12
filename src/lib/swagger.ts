export function getSwaggerSpec() {
  return {
    openapi: '3.0.3',
    info: {
      title: 'PrimeTradeAI API',
      description: 'Full-Stack PrimeTradeAI Platform API — Authentication, RBAC, and Product Management',
      version: '1.0.0',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication & authorization endpoints' },
      { name: 'Products', description: 'Product CRUD operations' },
    ],
    paths: {
      '/api/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          description: 'Create a new user account. Default role is "user". Rate limited to 5 requests per 15 minutes.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
                example: { name: 'John Doe', email: 'john@example.com', password: 'password123' },
              },
            },
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
            },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            '409': { description: 'Email already exists' },
            '429': { description: 'Rate limit exceeded' },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          description: 'Authenticate with email and password. Rate limited to 10 requests per 15 minutes.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
                example: { email: 'john@example.com', password: 'password123' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
            },
            '401': { description: 'Invalid credentials' },
            '429': { description: 'Rate limit exceeded' },
          },
        },
      },
      '/api/v1/auth/profile': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          description: 'Returns the authenticated user\'s profile. Requires Bearer token.',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'Profile fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/api/v1/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          description: 'Exchange a valid refresh token for a new access/refresh token pair.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: { refreshToken: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Tokens refreshed successfully' },
            '401': { description: 'Invalid refresh token' },
          },
        },
      },
      '/api/v1/products': {
        get: {
          tags: ['Products'],
          summary: 'Get all products',
          description: 'List products with pagination, search, sorting, and filtering. Public endpoint.',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Text search on title and description' },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['title', 'price', 'createdAt', 'stock', 'category'], default: 'createdAt' } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'minPrice', in: 'query', schema: { type: 'number' } },
            { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          ],
          responses: {
            '200': {
              description: 'Products list with pagination',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedProducts' } } },
            },
          },
        },
        post: {
          tags: ['Products'],
          summary: 'Create a product (Admin only)',
          description: 'Create a new product. Requires admin role.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateProduct' },
                example: { title: 'New Product', description: 'Product description', price: 29.99, category: 'electronics', stock: 100 },
              },
            },
          },
          responses: {
            '201': { description: 'Product created successfully' },
            '400': { description: 'Validation error' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Admin access required' },
          },
        },
      },
      '/api/v1/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get product by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { description: 'Product details' },
            '404': { description: 'Product not found' },
          },
        },
        put: {
          tags: ['Products'],
          summary: 'Update product (Admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProduct' } } },
          },
          responses: {
            '200': { description: 'Product updated successfully' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Admin access required' },
            '404': { description: 'Product not found' },
          },
        },
        delete: {
          tags: ['Products'],
          summary: 'Delete product (Admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { description: 'Product deleted successfully' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Admin access required' },
            '404': { description: 'Product not found' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
        CreateProduct: {
          type: 'object',
          required: ['title', 'description', 'price', 'category', 'stock'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', minimum: 0 },
            category: { type: 'string' },
            stock: { type: 'integer', minimum: 0 },
            imageUrl: { type: 'string', format: 'uri' },
          },
        },
        UpdateProduct: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            stock: { type: 'integer' },
            imageUrl: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            stock: { type: 'integer' },
            imageUrl: { type: 'string' },
            createdBy: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PaginatedProducts: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  };
}
