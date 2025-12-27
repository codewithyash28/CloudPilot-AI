# CloudPilot-AI

An Odoo-inspired full-stack modular business management platform featuring AI-powered architecture and business advisory.

CloudPilot-AI helps small and medium businesses manage customers, orders, inventory and invoices — and provides AI-driven recommendations (demand forecasting, next-best-action, business advisory) using Google Cloud Vertex AI / Gemini. This repository contains the frontend (React + TypeScript) and backend microservices scaffolding (Node/TypeScript) designed to be extended with real-time streaming (Confluent / Pub/Sub), observability (Datadog), and voice capabilities (ElevenLabs).

---

## Quick demo (what to show judges)
- Create a customer → create an order → inventory goes low → system suggests reorder with quantity (prediction from Vertex AI).
- Show Datadog dashboard for request latency, model metrics, and incidents (if integrated).
- Show streaming flow (if Confluent is enabled): event produced → stream processor enriches → action published → UI updated.

---

## Features (MVP)
- Modular business modules: Contacts/Customers, Products, Inventory, Orders, Invoices
- AI advisory: Context-aware recommendations using Vertex AI / Gemini
- Extensible microservice architecture ready for:
  - Real-time streaming (Confluent or Google Pub/Sub)
  - Observability & monitoring (Datadog)
  - Voice interactions (ElevenLabs)
- Secure AI proxy pattern (server-side model calls)
- Example YAML / JSON schemas for domain events and Datadog dashboard/monitor exports (in /infra or /observability)

---

## Tech stack
- Frontend: React + TypeScript, Vite
- Backend: Node.js + TypeScript (Cloud Run friendly)
- Database: PostgreSQL (Cloud SQL recommended) or SQLite for dev
- Streaming: Confluent Cloud (Kafka) or Google Pub/Sub
- AI: Google Vertex AI / Gemini
- Observability: Datadog (APM, Logs, Metrics, RUM)
- Voice: ElevenLabs (TTS) and Vertex Speech (STT) (optional)
- Analytics: BigQuery (optional long-term telemetry)

---

## Architecture (high level)

```mermaid
flowchart LR
  subgraph FE[Frontend]
    A[React UI]
  end

  subgraph BE[Backend]
    B[AI Proxy Service]
    C[Inventory Service]
    D[Stream Processor]
    E[Auth / API Gateway]
  end

  A -->|API| E
  E --> B
  E --> C
  C -->|emit event| D
  D -->|calls| B
  B -->|calls| Vertex[Vertex AI / Gemini]
  D -->|publish| Kafka[Confluent / PubSub]
  B -->|metrics/logs/traces| Datadog
  A -->|RUM| Datadog
```

---

## Getting started (local dev)

Prerequisites:
- Node 18+
- npm or pnpm
- PostgreSQL (or use SQLite)
- Google Cloud project with Vertex AI enabled (for AI features)
- (Optional) Confluent account for streaming
- (Optional) Datadog account for observability

1. Clone the repo
```bash
git clone https://github.com/codewithyash28/CloudPilot-AI.git
cd CloudPilot-AI
```

2. Install dependencies (frontend & backend)
```bash
npm install
# or if monorepo, run in frontend/ and backend/ directories
```

3. Copy environment example
Create a `.env` file based on `.env.example` (see below). Never commit real keys.

4. Run frontend (dev)
```bash
cd frontend
npm run dev
```

5. Run backend (dev)
```bash
cd backend
npm run dev
```

---

## .env.example (sample variables)
Create a `.env` locally and set values or use Secret Manager in production.

```
# Database
DATABASE_URL=postgres://user:pass@localhost:5432/cloudpilot

# Vertex AI
VERTEX_API_KEY=your_vertex_api_key
VERTEX_PROJECT=your-gcp-project
VERTEX_LOCATION=us-central1

# Datadog (optional)
DATADOG_API_KEY=your_dd_api_key
DATADOG_APP_KEY=your_dd_app_key
DATADOG_SERVICE=cloudpilot-backend

# Confluent (optional)
CONFLUENT_BOOTSTRAP_SERVERS=<bootstrap_servers>
CONFLUENT_API_KEY=<api_key>
CONFLUENT_API_SECRET=<api_secret>

# ElevenLabs (optional)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# App
PORT=8080
NODE_ENV=development
```

---

## AI Proxy (security note)
All calls to Vertex/Gemini must go through a secure server-side AI proxy. Do NOT place Vertex/Gemini API keys in the client. The AI proxy centralizes:
- model access
- request/response logging (redacted)
- Datadog instrumentation (traces/metrics/logs)
- rate-limiting and safety checks

Example endpoint (pseudo):
```
POST /api/ai/generate
Headers: Authorization: Bearer <token>
Body: { prompt, userContext, temperature }
```

The proxy returns only redacted/necessary fields to the frontend and includes trace IDs for debugging.

---

## Observability (Datadog) — recommended minimal setup
- Instrument backend with OpenTelemetry or Datadog SDK
- Emit per-request metrics:
  - request_id, model_name, latency_ms, tokens_in, tokens_out, safety_flags, user_id (hashed)
- Send traces to Datadog APM and structured logs to Datadog Logs
- Create monitors:
  - Latency spike (p95)
  - Error rate increase
  - Token-surge anomaly
  - Safety-filter spike
  - Hallucination-rate spike (if implemented)
- Export dashboard & monitors JSON into `/observability` for judges to import

---

## Real-time streaming (Confluent) — quick plan
- Topics:
  - domain.events (order.created, inventory.low, invoice.paid)
  - ai.actions (reorder.suggested, alert.created)
- Producer: Services (Inventory, Orders) publish events
- Consumer/stream processor: Cloud Run service consumes events, enriches using Vertex AI, and publishes actions
- UI: subscribe to ai.actions via WebSocket or server-sent events for live updates

---

## Hallucination, PII & Drift (operations)
- Hallucination detection: Implement a verification step or embedding-similarity checks and expose a `hallucination_score` metric.
- PII redaction: Detect and redact sensitive data before persisting or shipping to logs. Store hashed identifiers for debugging (salted SHA256).
- Drift detection: Use Vertex embeddings to compute centroid and measure cosine distance for incoming inputs. Emit drift metric to Datadog.

---

## Deployment (recommended)
- Deploy backend services to Cloud Run (one service per microservice).
- Use Cloud SQL (Postgres) for production DB.
- Use Secret Manager to store sensitive keys (Vertex, Datadog, Confluent).
- Frontend can be deployed to Vercel or Firebase Hosting.
- For streaming, use Confluent Cloud or Pub/Sub.

Example: Deploy backend to Cloud Run
```bash
gcloud run deploy cloudpilot-backend \
  --image gcr.io/<project>/cloudpilot-backend:latest \
  --region us-central1 \
  --set-secrets VERTEX_API_KEY=projects/<proj>/secrets/VERTEX_API_KEY:latest
```

---

## Demo tips and synthetic harness
- Include a synthetic harness (`/tools/synthetic-harness`) to reproduce anomalies:
  - simulate high-latency Vertex responses
  - spike safety-triggering prompts
  - create token-surge responses
- Use the harness during demo to trigger Datadog monitors and show incidents being created with helpful context.

---

## Roadmap & suggested features
- Multi-tenant support & tenant isolation
- Automated remediation: Datadog webhook toggles safe-mode or traffic-splitting between model versions
- Incident triage UI for AI engineers (re-run requests, redact, annotate)
- Exportable incident playbooks and example postmortems
- Integration with third-party ERPs and CRMs via connectors

---

## Contributing
Contributions are welcome! Please:
1. Open an issue describing the feature or bug.
2. Fork the repo and create a feature branch.
3. Make changes and submit a pull request with tests where appropriate.

See CONTRIBUTING.md for more details (add one if needed).

---

## Security & privacy
- Do not commit API keys or secrets.
- Use Secret Manager in production and `.env` for local development only.
- Redact PII in logs and incidents; keep hashed identifiers for reproducibility.
- Audit third-party SDK usage and keep dependencies up-to-date.

---



---



---

