import { spawn, type ChildProcess } from 'child_process';
import { serverConfig, getConfigPath } from '../config.js';
import fs from 'fs/promises';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export interface CommandOutput {
  type: 'stdout' | 'stderr' | 'exit' | 'error';
  data: string;
  code?: number;
}

export type OutputCallback = (output: CommandOutput) => void;

async function ensureConfigDir(): Promise<void> {
  await fs.mkdir(serverConfig.configDir, { recursive: true });
}

function runBouncerCommand(
  args: string[],
  onOutput: OutputCallback
): ChildProcess {
  const proc = spawn(serverConfig.bouncerBinaryPath, args, {
    env: { ...process.env },
  });

  proc.stdout.on('data', (data: Buffer) => {
    onOutput({ type: 'stdout', data: data.toString() });
  });

  proc.stderr.on('data', (data: Buffer) => {
    onOutput({ type: 'stderr', data: data.toString() });
  });

  proc.on('close', (code) => {
    onOutput({ type: 'exit', data: '', code: code ?? 0 });
  });

  proc.on('error', (err) => {
    onOutput({ type: 'error', data: err.message });
  });

  return proc;
}

export async function generateConfig(
  cloudflareToken: string,
  crowdsecLapiUrl: string,
  crowdsecLapiKey: string,
  onOutput: OutputCallback
): Promise<void> {
  await ensureConfigDir();
  const configPath = getConfigPath();

  const proc = runBouncerCommand(['-g', cloudflareToken, '-o', configPath], onOutput);

  // Wait for config generation to complete, then update with lapi credentials
  proc.on('close', async (code) => {
    if (code === 0 && crowdsecLapiUrl && crowdsecLapiKey) {
      try {
        const configContent = await fs.readFile(configPath, 'utf-8');
        const config = parseYaml(configContent);

        config.crowdsec_config = {
          ...config.crowdsec_config,
          lapi_url: crowdsecLapiUrl,
          lapi_key: crowdsecLapiKey,
        };

        await fs.writeFile(configPath, stringifyYaml(config));
        onOutput({ type: 'stdout', data: 'CrowdSec credentials added to config.\n' });
      } catch (err) {
        onOutput({ type: 'stderr', data: `Failed to update config with credentials: ${err}\n` });
      }
    }
  });
}

export async function deployAutonomous(
  crowdsecLapiUrl: string,
  crowdsecLapiKey: string,
  onOutput: OutputCallback
): Promise<void> {
  const configPath = getConfigPath();

  // Read and update config with CrowdSec credentials
  const configContent = await fs.readFile(configPath, 'utf-8');
  const config = parseYaml(configContent);

  config.crowdsec_config = {
    ...config.crowdsec_config,
    lapi_url: crowdsecLapiUrl,
    lapi_key: crowdsecLapiKey,
  };

  await fs.writeFile(configPath, stringifyYaml(config));

  runBouncerCommand(['-S', '-c', configPath], onOutput);
}

export async function clearInfrastructure(
  onOutput: OutputCallback
): Promise<void> {
  const configPath = getConfigPath();

  // Check if config exists
  try {
    await fs.access(configPath);
  } catch {
    onOutput({ type: 'error', data: 'No configuration found. Nothing to clear.' });
    onOutput({ type: 'exit', data: '', code: 1 });
    return;
  }

  runBouncerCommand(['-d', '-c', configPath], onOutput);
}

export async function testConfig(onOutput: OutputCallback): Promise<void> {
  const configPath = getConfigPath();

  runBouncerCommand(['-t', '-c', configPath], onOutput);
}

export interface ZoneInfo {
  id: string;
  domain: string;
  accountId: string;
  accountName: string;
  actions: string[];
  defaultAction: string;
  selected: boolean;
}

export async function getZonesFromConfig(): Promise<ZoneInfo[]> {
  const configPath = getConfigPath();

  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = parseYaml(configContent);

    const zones: ZoneInfo[] = [];

    for (const account of config.cloudflare_config?.accounts || []) {
      for (const zone of account.zones || []) {
        // Extract domain from comment in config or use zone_id
        // The bouncer adds domain as comment, but YAML parser doesn't preserve comments
        // We'll need to extract it differently or show zone_id
        zones.push({
          id: zone.zone_id,
          domain: zone.routes_to_protect?.[0]?.replace(/^\*/, '').replace(/\/\*$/, '') || zone.zone_id,
          accountId: account.id,
          accountName: account.account_name || account.id,
          actions: zone.actions || ['captcha'],
          defaultAction: zone.default_action || 'captcha',
          selected: true,
        });
      }
    }

    return zones;
  } catch {
    return [];
  }
}

export async function updateConfigWithSelectedZones(
  selectedZoneIds: string[]
): Promise<void> {
  const configPath = getConfigPath();
  const configContent = await fs.readFile(configPath, 'utf-8');
  const config = parseYaml(configContent);

  // Filter zones to only include selected ones
  for (const account of config.cloudflare_config?.accounts || []) {
    account.zones = (account.zones || []).filter((zone: { zone_id: string }) =>
      selectedZoneIds.includes(zone.zone_id)
    );
  }

  // Remove accounts with no zones
  config.cloudflare_config.accounts = config.cloudflare_config.accounts.filter(
    (account: { zones: unknown[] }) => account.zones && account.zones.length > 0
  );

  await fs.writeFile(configPath, stringifyYaml(config));
}
