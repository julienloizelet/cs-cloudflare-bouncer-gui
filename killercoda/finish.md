# Congratulations!

You have successfully deployed the CrowdSec Cloudflare Worker Bouncer in autonomous mode.

## What happens now?

Your bouncer is running autonomously on Cloudflare:

- **Every 5 minutes**: The decisions-sync worker fetches the latest decisions from your CrowdSec blocklist mirror and updates the KV store
- **On every request**: The main worker checks incoming IPs against the KV store and applies the configured action (ban or captcha)

## Monitoring

### Cloudflare Dashboard

- View worker invocations and errors in **Workers & Pages** > **Your Worker** > **Metrics**
- Check KV storage usage in **Workers & Pages** > **KV**
- Monitor D1 database for metrics in **Workers & Pages** > **D1**

### CrowdSec Console

If using CrowdSec Console blocklists, you can monitor:

- Blocklist sync status
- Number of active decisions
- Bouncer enrollment status

## Cleaning Up

To remove all bouncer infrastructure from Cloudflare:

1. Open the Bouncer GUI
2. Select **Clear**
3. Enter your Cloudflare API token
4. Confirm the operation

This will remove:
- Worker scripts
- Worker routes
- KV namespaces
- D1 databases
- Turnstile widgets

## Learn More

- [CrowdSec Documentation](https://docs.crowdsec.net/)
- [Cloudflare Worker Bouncer GitHub](https://github.com/crowdsecurity/cs-cloudflare-worker-bouncer)
- [CrowdSec Console](https://app.crowdsec.net)

## Feedback

If you encountered any issues or have suggestions, please open an issue on GitHub or join the [CrowdSec Discord](https://discord.gg/crowdsec).

Thank you for using CrowdSec!