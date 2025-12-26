import { Router, Request, Response } from 'express';
import {
  getZonesFromConfig,
  updateConfigWithSelectedZones,
} from './services/bouncer.js';

const router = Router();

// Generate config from Cloudflare token
router.post('/generate-config', async (req: Request, res: Response) => {
  const { cloudflareToken } = req.body;

  if (!cloudflareToken) {
    res.status(400).json({ error: 'Cloudflare token is required' });
    return;
  }

  // This endpoint just triggers config generation
  // Real-time output is sent via WebSocket
  res.json({ message: 'Config generation started. Watch WebSocket for output.' });
});

// Get zones from generated config
router.get('/zones', async (_req: Request, res: Response) => {
  try {
    const zones = await getZonesFromConfig();
    res.json({ zones });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read zones from config' });
  }
});

// Update config with selected zones
router.post('/zones/select', async (req: Request, res: Response) => {
  const { selectedZoneIds } = req.body;

  if (!Array.isArray(selectedZoneIds)) {
    res.status(400).json({ error: 'selectedZoneIds must be an array' });
    return;
  }

  try {
    await updateConfigWithSelectedZones(selectedZoneIds);
    res.json({ message: 'Config updated with selected zones' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default router;