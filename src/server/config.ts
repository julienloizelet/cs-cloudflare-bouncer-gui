import { config } from 'dotenv';
import path from 'path';

config();

export const serverConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  bouncerBinaryPath: process.env.BOUNCER_BINARY_PATH || 'crowdsec-cloudflare-worker-bouncer',
  configDir: process.env.CONFIG_DIR || '/tmp/crowdsec-bouncer-gui',
  isDev: process.env.NODE_ENV !== 'production',
};

export function getConfigPath(): string {
  return path.join(serverConfig.configDir, 'config.yaml');
}