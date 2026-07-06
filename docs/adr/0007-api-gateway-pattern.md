# ADR-0007: API Gateway as Single Entry Point

**Status:** Accepted  
**Date:** 2026-07-06  
**Deciders:** Li Hong  
**Related:** [01-Architecture.md](../01-Architecture.md), [07-Security.md](../07-Security.md)

---

## Context

Multiple backend services expose REST APIs. Clients should not hold service-specific URLs, CORS policies, or JWT validation logic. A single perimeter simplifies security, rate limiting, and observability.

---

## Decision

Implement **API Gateway** (`@novadesk/gateway`) as the sole HTTP entry point for backend APIs:

Responsibilities:

1. JWT validation (RS256 via JWKS from Auth Service)
2. Rate limiting (Redis-backed sliding window)
3. Request ID assignment and propagation
4. Reverse proxy to target service by path prefix
5. WebSocket upgrade proxy for Realtime Chat
6. CORS policy enforcement
7. Circuit breaker for unhealthy upstreams (configurable)

Clients call `/api/v1/*` only. Internal service URLs are not exposed to browsers.

Nginx sits in front for TLS termination and static path routing to Next.js apps.

---

## Alternatives considered

| Alternative           | Rejected because                                               |
| --------------------- | -------------------------------------------------------------- |
| Direct service access | CORS and auth duplicated per service                           |
| Kong/AWS API Gateway  | External dependency; less code visibility in portfolio         |
| GraphQL federation    | REST aligns with NovaDesk API standards; simpler for reviewers |
| Service mesh (Istio)  | Operational complexity unjustified                             |

---

## Consequences

### Positive

- Single place for auth, rate limits, and request logging
- Services trust gateway-injected identity headers on internal network
- Clear diagram for architecture interviews

### Negative

- Gateway becomes critical path — requires health monitoring and horizontal scale plan
- Added network hop latency (minimal on same host/Docker network)

---

## Compliance

Documented in [16-Service-Catalog.md](../16-Service-Catalog.md) and request flow page.
