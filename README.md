# CrowdSec Cloudflare Bouncer GUI

A web-based GUI for configuring and deploying the [CrowdSec Cloudflare Worker Bouncer](https://github.com/crowdsecurity/cs-cloudflare-worker-bouncer) in autonomous mode.

## Features

- Deploy bouncer infrastructure to Cloudflare zones
- Select which zones to protect
- Real-time command output streaming
- Clear/remove all bouncer infrastructure

## Quick Start

### Prerequisites

- Node.js 18+
- The `crowdsec-cloudflare-worker-bouncer` binary installed and in PATH

### Installation

```bash
git clone https://github.com/crowdsecurity/cs-cloudflare-bouncer-gui.git
cd cs-cloudflare-bouncer-gui
npm install
```

### Development

```bash
npm run dev
```

Opens at http://localhost:5173

### Production

```bash
npm run build
npm start
```

Opens at http://localhost:3000

## Configuration

Create a `.env` file (see `.env.example`):

```bash
BOUNCER_BINARY_PATH=crowdsec-cloudflare-worker-bouncer
PORT=3000
```

## Usage

1. **Select Action**: Choose Deploy or Clear
2. **Enter Credentials**: Provide Cloudflare API token and CrowdSec blocklist mirror credentials
3. **Select Zones**: Choose which Cloudflare zones to protect
4. **Deploy**: Watch real-time output as infrastructure is created

## Documentation

See [docs/DEVELOPER.md](docs/DEVELOPER.md) for development documentation.

## License

MIT
