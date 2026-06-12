# Scalability Strategy

This document outlines the scalability strategies for evolving this application from a single-instance Next.js monolith to a highly available, distributed system.

---

## 1. Horizontal Scaling

### Current State
- Single Next.js instance serving both frontend and API
- Suitable for development and moderate traffic

### Strategy
- **Vercel Auto-scaling**: Deploy on Vercel for automatic serverless scaling of API routes
- **Container Orchestration**: Use Kubernetes (K8s) or AWS ECS for Docker-based horizontal scaling
- **Load Balancer**: Add Nginx or AWS ALB in front of multiple instances
- **Stateless API Design**: Current JWT-based auth is already stateless, enabling seamless horizontal scaling

### Implementation
```yaml
# Example K8s deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: internship-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: internship-app
  template:
    spec:
      containers:
        - name: app
          image: internship-app:latest
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

---

## 2. Redis Caching Integration

### Strategy
Replace the in-memory rate limiter and add application-level caching.

### Use Cases
| Cache Target       | TTL    | Invalidation Strategy      |
| ------------------- | ------ | -------------------------- |
| Product list        | 5 min  | Invalidate on CRUD ops     |
| Product by ID       | 10 min | Invalidate on update/delete|
| User sessions       | 1 day  | Invalidate on logout       |
| Rate limit counters | 15 min | Auto-expire                |

### Implementation
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache-aside pattern
async function getProduct(id: string) {
  const cached = await redis.get(`product:${id}`);
  if (cached) return JSON.parse(cached);

  const product = await Product.findById(id);
  await redis.set(`product:${id}`, JSON.stringify(product), 'EX', 600);
  return product;
}
```

---

## 3. Load Balancing

### Options
| Solution         | Use Case                              |
| ---------------- | ------------------------------------- |
| Vercel Edge      | Global CDN + serverless (recommended) |
| Nginx            | Self-hosted reverse proxy             |
| AWS ALB          | AWS-hosted load balancer              |
| Cloudflare       | CDN + DDoS protection                 |

### Nginx Configuration
```nginx
upstream app_servers {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 4. Microservices Migration Strategy

### Phase 1: Modular Monolith (Current)
- Service layer separation (auth.service, product.service)
- Clean architecture boundaries
- Shared database

### Phase 2: API Gateway
- Extract API routes behind an API gateway (Kong, AWS API Gateway)
- Route traffic by path prefix
- Centralized rate limiting and auth

### Phase 3: Service Extraction
```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│ API Gateway  │────▶│ Auth Service     │────▶│ Users DB     │
│ (Kong/AWS)   │     │ (Node.js)        │     │ (MongoDB)    │
│              │     └──────────────────┘     └──────────────┘
│              │     ┌──────────────────┐     ┌──────────────┐
│              │────▶│ Product Service  │────▶│ Products DB  │
│              │     │ (Node.js)        │     │ (MongoDB)    │
│              │     └──────────────────┘     └──────────────┘
│              │     ┌──────────────────┐
│              │────▶│ Notification Svc │
│              │     │ (Node.js)        │
└──────────────┘     └──────────────────┘
```

### Phase 4: Event-Driven Architecture
- Add message broker (RabbitMQ / Apache Kafka)
- Event sourcing for audit trails
- Async inter-service communication

---

## 5. Database Optimization

### Indexing (Already Implemented)
- Email unique index on Users
- Text index on Product title + description
- Category index for filtering
- Price index for range queries
- Compound index on createdBy + createdAt

### Future Optimizations
| Optimization       | Benefit                                |
| ------------------- | -------------------------------------- |
| MongoDB Sharding   | Distribute data across servers         |
| Read Replicas      | Scale read-heavy workloads             |
| Connection Pooling | Reduce connection overhead (maxPoolSize: 10) |
| Aggregation Pipelines | Complex analytics and reporting     |
| TTL Indexes        | Auto-delete expired sessions/tokens    |

### Sharding Strategy
```javascript
// Shard on category for products (range-based)
sh.shardCollection("internship-db.products", { category: 1 });

// Shard on email for users (hashed)
sh.shardCollection("internship-db.users", { email: "hashed" });
```

---

## 6. Queue Systems (BullMQ)

### Use Cases
| Queue            | Purpose                              | Priority |
| ---------------- | ------------------------------------ | -------- |
| email-queue      | Send welcome/notification emails     | Normal   |
| image-queue      | Process and resize product images    | Low      |
| export-queue     | Generate CSV/PDF reports             | Low      |
| notification-queue | Push notifications                 | High     |

### Implementation
```typescript
import { Queue, Worker } from 'bullmq';

const emailQueue = new Queue('email', {
  connection: { host: 'redis', port: 6379 }
});

// Producer
await emailQueue.add('welcome-email', {
  to: user.email,
  name: user.name,
});

// Worker
const worker = new Worker('email', async (job) => {
  await sendEmail(job.data);
}, { connection: { host: 'redis', port: 6379 } });
```

---

## 7. Additional Scaling Considerations

### CDN for Static Assets
- Serve Next.js static files via Vercel Edge Network
- Image optimization with `next/image`
- Cache-Control headers for API responses

### Monitoring & Observability
- **Application Monitoring**: Vercel Analytics, Datadog, or New Relic
- **Error Tracking**: Sentry for error reporting
- **Logging**: Winston → ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM**: Distributed tracing with OpenTelemetry

### Security at Scale
- WAF (Web Application Firewall) via Cloudflare or AWS WAF
- DDoS protection
- API key rotation policies
- Secrets management with AWS Secrets Manager or Vault

### Cost Optimization
- Auto-scaling policies to match traffic patterns
- Reserved instances for predictable workloads
- Spot instances for non-critical batch processing
- Database right-sizing based on actual usage

---

## Summary

| Phase | Focus               | Timeline   |
| ----- | ------------------- | ---------- |
| 1     | Vertical scaling    | Current    |
| 2     | Redis caching       | Week 1-2   |
| 3     | Horizontal scaling  | Month 1    |
| 4     | API Gateway         | Month 2    |
| 5     | Service extraction  | Month 3-6  |
| 6     | Event-driven arch   | Month 6+   |

The current architecture is designed with these transitions in mind — clean service boundaries, stateless auth, and modular code organization make each phase a natural evolution.
