# CrowdSec Cloudflare Worker Bouncer

Welcome to the CrowdSec Cloudflare Worker Bouncer setup wizard!

## What you will learn

In this tutorial, you will deploy the CrowdSec Cloudflare Worker Bouncer in **autonomous mode**. This bouncer protects your Cloudflare zones by:

- Checking incoming IPs against CrowdSec decisions
- Applying remediations (ban, captcha) at the Cloudflare edge
- Syncing decisions automatically every 5 minutes

## Prerequisites

Before starting, make sure you have:

1. **Cloudflare API Token** with the following permissions:
   - Account > Workers Scripts > Edit
   - Account > Workers KV Storage > Edit
   - Account > Workers Tail > Read
   - Account > D1 > Edit
   - Account > Account Settings > Read
   - Zone > Workers Routes > Edit
   - Zone > Zone > Read
   - User > User Details > Read

2. **CrowdSec Blocklist Mirror URL** and **API Key** from:
   - Your self-hosted CrowdSec instance, or
   - [CrowdSec Console](https://app.crowdsec.net) blocklist subscription

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Incoming   │────▶│ Cloudflare  │────▶│   Your      │
│  Request    │     │   Worker    │     │   Origin    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  CrowdSec │
                    │  KV Store │
                    └───────────┘
```

The worker checks each request against decisions stored in Cloudflare KV and applies the appropriate action (allow, captcha, or ban).

Click **Start** to begin!