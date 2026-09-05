# CommercePilot 🚀

A lightweight merchant growth workspace with an AI agent for Razorpay Buildathon 2026 — Track 1: AI Growth & Agentic Commerce.

## What it does

CommercePilot turns merchant data into actionable growth workflows:

1. Analyzes sales, customers, and payment behavior.
2. Detects growth opportunities.
3. Explains the opportunity and recommends an action.
4. Uses an AI agent to create a structured growth plan.
5. Lets the merchant approve and simulate execution.
6. Tracks the resulting campaign/workflow.

The demo is designed to work immediately with mock data. An optional OpenAI integration can be enabled with an API key.

## Demo flow

Dashboard → AI Growth Agent → Opportunity → Recommendation → Approve → Execute → Results

## Tech stack

- React + Vite
- Express.js
- OpenAI API (optional)
- Recharts
- Node.js

## Run locally

### 1. Server

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux:

```bash
cp .env.example .env
npm install
npm run dev
```

Server: http://localhost:5000

### 2. Client

```bash
cd client
npm install
npm run dev
```

Client: http://localhost:5173

The client proxies `/api` requests to the Express server.

## Optional AI mode

Create `server/.env`:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=5000
```

Without a key, CommercePilot uses a deterministic local agent so the complete demo still works.

## Project structure

```text
commercepilot/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── index.js
│   ├── agent.js
│   ├── data.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Important demo note

The payment and campaign execution layer in this prototype is simulated. No real customer messages or real payments are triggered. This makes the build safe for demonstration while preserving the agentic workflow.
