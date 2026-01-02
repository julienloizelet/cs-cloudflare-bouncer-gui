# Developer Guide

This document provides instructions for setting up and developing the CrowdSec Cloudflare Bouncer GUI.

## Prerequisites

- Node.js 18+
- npm
- Access to the `crowdsec-cloudflare-worker-bouncer` Go binary

## Project Setup

```bash
# Clone the repository
git clone https://github.com/crowdsecurity/cs-cloudflare-bouncer-gui.git
cd cs-cloudflare-bouncer-gui

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
```

Edit `.env` to set the path to your local bouncer binary:

```bash
BOUNCER_BINARY_PATH=/path/to/crowdsec-cloudflare-worker-bouncer
PORT=3000
```

## Development

Start both the backend and frontend in development mode:

```bash
npm run dev
```

This runs concurrently:
- **Frontend (Vite)**: http://localhost:5173
- **Backend (Express)**: http://localhost:3000

The Vite dev server proxies API requests to the Express backend.

### Individual Commands

```bash
npm run dev:client    # Start Vite dev server only
npm run dev:server    # Start Express server only (with hot reload)
npm run typecheck     # Run TypeScript type checking
npm run lint          # Run ESLint
```

## Building for Production

```bash
npm run build         # Build both client and server
npm start             # Run production server
```

The production build:
- Compiles React app to `dist/client/`
- Compiles Express server to `dist/server/`
- Express serves the static React build

## Project Structure

```
src/
├── client/                 # React frontend
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Main wizard component
│   ├── index.css          # Tailwind CSS
│   ├── types.ts           # TypeScript types
│   ├── hooks/
│   │   └── useSocket.ts   # WebSocket hook for real-time communication
│   └── components/
│       ├── Header.tsx         # App header
│       ├── ActionSelect.tsx   # Step 1: Deploy/Clear selection
│       ├── CredentialsForm.tsx # Step 2: Token input
│       ├── ClearConfirm.tsx   # Step 3a: Clear confirmation
│       ├── ZoneSelect.tsx     # Step 3b: Zone selection
│       ├── CommandOutput.tsx  # Real-time command output
│       └── SuccessScreen.tsx  # Completion screen
│
└── server/                 # Express backend
    ├── index.ts           # Server entry point + WebSocket setup
    ├── config.ts          # Environment configuration
    ├── routes.ts          # REST API routes
    └── services/
        └── bouncer.ts     # Bouncer command execution service
```

## API Reference

### REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/zones` | GET | Get zones from generated config |
| `/api/zones/select` | POST | Update config with selected zones |

### WebSocket Events

**Client → Server:**

| Event | Payload | Description |
|-------|---------|-------------|
| `generate-config` | `{ cloudflareToken }` | Generate config from CF token |
| `get-zones` | - | Request zones from config |
| `update-zones` | `{ selectedZoneIds }` | Update selected zones |
| `deploy` | `{ crowdsecLapiUrl, crowdsecLapiKey }` | Deploy autonomous mode |
| `clear` | - | Clear infrastructure |

**Server → Client:**

| Event | Payload | Description |
|-------|---------|-------------|
| `command-output` | `{ type, data, code? }` | Real-time command output |
| `zones-loaded` | `{ zones }` | Zone list response |
| `zones-updated` | `{ success }` | Zone update confirmation |
| `zones-error` | `{ error }` | Zone operation error |

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Socket.IO, TypeScript
- **Build**: Vite (frontend), tsc (backend)
- **Runtime**: Node.js 18+

## KillerCoda Scenario

The `killercoda/` directory contains an interactive tutorial for [KillerCoda](https://killercoda.com).

### Structure

```
killercoda/
├── index.json      # Scenario configuration
├── intro.md        # Introduction page (prerequisites)
├── finish.md       # Setup page (shown after Start)
├── background.sh   # Installs Node.js, Go, bouncer, and GUI
└── foreground.sh   # Shows setup progress in terminal
```

### Flow

1. **Intro**: User reads prerequisites, clicks Start
2. **Finish**: Scripts run, terminal shows progress, user clicks GUI link when ready

### Key Configuration

- `index.json`: Defines intro → finish flow (no steps)
- `background.sh`: Spawns setup as detached process to avoid KillerCoda timeout
- `foreground.sh`: Waits for `/tmp/.setup-complete` and shows progress
- GUI link uses `{{TRAFFIC_HOST1_3000}}` variable (replaced by KillerCoda at runtime)

### Testing Locally

KillerCoda scenarios can only be tested on the platform. Push changes to a GitHub repository and link it to KillerCoda.

### Logs

When running on KillerCoda:
- Setup logs: `/var/log/setup.log`
- GUI server logs: `/var/log/bouncer-gui.log`