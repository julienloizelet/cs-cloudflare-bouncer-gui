import { Router, type Request, type Response } from 'express';
import {
  getZonesFromConfig,
  updateConfigWithSelectedZones,
} from './services/bouncer.js';

const router = Router();

// Get zones from generated config
router.get('/zones', async (_req: Request, res: Response) => {
  try {
    const zones = await getZonesFromConfig();
    res.json({ zones });
  } catch (_error) {
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
  } catch (_error) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default router;
