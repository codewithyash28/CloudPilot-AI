CloudPilot-AI ☁️

An Odoo-inspired, AI-powered business management and advisory platform

CloudPilot-AI is a full-stack, modular business management platform designed for small and medium businesses.
It combines ERP-style workflows with AI-driven decision support, helping teams manage daily operations while making smarter, data-backed business decisions.

The platform is built with a modern cloud-native architecture and is designed to scale from a hackathon MVP to a real-world production system.

Why CloudPilot-AI

Most SMBs rely on disconnected tools for customers, inventory, orders, and invoicing.
Decision-making is often reactive and manual.

CloudPilot-AI solves this by:

unifying core business operations

observing real-time business events

providing AI-driven recommendations such as demand forecasting and next-best-action

offering a clean path to production with observability, streaming, and security built in

Key capabilities
Business management (ERP-style)

Customers / Contacts

Products

Inventory

Orders

Invoices

AI-powered advisory

Demand forecasting

Inventory reorder suggestions

Context-aware business recommendations

Explainable outputs with reasoning

Cloud-native architecture

Modular microservices

Secure server-side AI proxy

Designed for Cloud Run deployments

Extensible for streaming, monitoring, and voice

Demo flow (for judges)

Create a customer

Create an order

Inventory drops below a threshold

CloudPilot-AI detects the event

AI suggests a reorder quantity and next action

Optional demo:

Show Datadog dashboard for latency and model metrics

Show streaming flow if enabled (event → AI enrichment → UI update)

Tech stack
Frontend

React

TypeScript

Vite

Backend

Node.js

TypeScript

Cloud Run friendly services

Database

PostgreSQL (recommended for production)

SQLite (local development)

AI

Google Cloud Vertex AI / Gemini

Observability (optional)

Datadog (APM, Logs, Metrics, RUM)

Streaming (optional)

Confluent Cloud (Kafka)

Google Pub/Sub

Voice (optional)

ElevenLabs (TTS)

Vertex Speech (STT)

High-level architecture

Frontend hosted on Vercel or Firebase Hosting

Backend microservices deployed on Cloud Run

Secure AI proxy for all Vertex AI calls

Optional event streaming layer

Centralized observability via Datadog

This design keeps the system secure, scalable, and production-ready.

Getting started (local development)
Prerequisites

Node.js 18+

npm or pnpm

PostgreSQL or SQLite

Google Cloud project with Vertex AI enabled (for AI features)

Optional:

Datadog account

Confluent account

Clone the repository
git clone https://github.com/codewithyash28/CloudPilot-AI.git
cd CloudPilot-AI

Install dependencies
npm install


If using a monorepo, install inside frontend/ and backend/ directories.

Run frontend
cd frontend
npm run dev

Run backend
cd backend
npm run dev

Environment variables

Create a .env file based on .env.example.
Never commit real secrets.

DATABASE_URL=postgres://user:pass@localhost:5432/cloudpilot

VERTEX_API_KEY=your_vertex_api_key
VERTEX_PROJECT=your-gcp-project
VERTEX_LOCATION=us-central1

DATADOG_API_KEY=your_dd_api_key
DATADOG_APP_KEY=your_dd_app_key

PORT=8080
NODE_ENV=development

AI proxy and security

All Vertex AI / Gemini calls must go through a server-side AI proxy.

Benefits:

no API keys in the client

centralized logging and tracing

rate limiting and safety checks

observability with Datadog

The frontend only receives redacted, necessary data.

Observability (Datadog)

Recommended metrics:

request latency

error rate

model usage

token counts

safety or anomaly signals

Dashboards and monitors can be exported for demos and audits.

Deployment (recommended)

Backend: Google Cloud Run

Database: Cloud SQL (PostgreSQL)

Secrets: Google Secret Manager

Frontend: Vercel or Firebase Hosting

Example:

gcloud run deploy cloudpilot-backend \
  --image gcr.io/<project>/cloudpilot-backend:latest \
  --region us-central1

Roadmap

Multi-tenant support

Automated remediation and safe-mode toggles

Incident triage UI for AI engineers

Drift and hallucination detection dashboards

ERP and CRM connectors

Contributing

Contributions are welcome.

Open an issue

Fork the repository

Create a feature branch

Submit a pull request

Security and privacy

Never commit secrets

Use Secret Manager in production

Redact PII from logs

Hash identifiers for debugging

Keep dependencies updated
