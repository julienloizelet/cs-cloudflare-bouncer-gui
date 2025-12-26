# Configure and Deploy the Bouncer

The GUI is now running. Click on the **Bouncer GUI** tab at the top of the terminal to open the web interface.

## Step 1: Select Action

When the GUI loads, you will see two options:

- **Deploy**: Set up the autonomous bouncer infrastructure on Cloudflare
- **Clear**: Remove all bouncer infrastructure (use this to clean up later)

Click **Deploy** to continue.

## Step 2: Enter Credentials

You will need to provide:

### Cloudflare API Token

Create a token at [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) with these permissions:

| Scope | Permission |
|-------|------------|
| Account > Workers Scripts | Edit |
| Account > Workers KV Storage | Edit |
| Account > Workers Tail | Read |
| Account > D1 | Edit |
| Account > Account Settings | Read |
| Zone > Workers Routes | Edit |
| Zone > Zone | Read |
| User > User Details | Read |

### CrowdSec Blocklist Mirror

Get your blocklist mirror URL and API key from:

1. **CrowdSec Console** (recommended): Go to [app.crowdsec.net](https://app.crowdsec.net), navigate to Blocklists, and create a subscription
2. **Self-hosted**: Use your own CrowdSec LAPI URL and bouncer API key

Enter both credentials and click **Continue**.

## Step 3: Select Zones

The GUI will fetch all zones available in your Cloudflare account.

- Use **Select All** / **Deselect All** to manage selections
- Use the search box to filter zones by name
- Toggle individual zones on/off

Select the zones you want to protect and click **Deploy**.

## Step 4: Watch the Deployment

The terminal output will show:

1. Creating KV namespace for decisions
2. Creating D1 database for metrics
3. Uploading worker scripts
4. Creating worker routes for each zone
5. Setting up Turnstile widgets for captcha challenges
6. Configuring cron triggers for automatic sync

## Verify Deployment

Once complete, you can verify in the Cloudflare dashboard:

1. Go to **Workers & Pages** > **Overview**
2. You should see `crowdsec-cloudflare-worker-bouncer` worker
3. Check **Workers Routes** in each zone to see the route bindings

## Troubleshooting

If deployment fails, check the terminal output for errors. Common issues:

- **Invalid API token**: Ensure all required permissions are granted
- **Rate limiting**: Wait a few minutes and try again
- **Zone not found**: Verify the zone is active in your Cloudflare account

You can view the server logs with:

```bash
tail -f /var/log/bouncer-gui.log
```

Or the setup logs:

```bash
cat /var/log/setup.log
```