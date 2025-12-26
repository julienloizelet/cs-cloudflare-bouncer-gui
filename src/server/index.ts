import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import { serverConfig } from './config.js';
import routes from './routes.js';
import {
  generateConfig,
  deployAutonomous,
  clearInfrastructure,
  getZonesFromConfig,
  updateConfigWithSelectedZones,
  CommandOutput,
} from './services/bouncer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: serverConfig.isDev ? 'http://localhost:5173' : false,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

// Serve static files in production
if (!serverConfig.isDev) {
  const clientPath = path.join(__dirname, '../client');
  app.use(express.static(clientPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// WebSocket handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  const sendOutput = (output: CommandOutput) => {
    socket.emit('command-output', output);
  };

  // Generate config from Cloudflare token
  socket.on('generate-config', async (data: {
    cloudflareToken: string;
    crowdsecLapiUrl: string;
    crowdsecLapiKey: string;
  }) => {
    console.log('Generating config...');
    console.log('crowdsecLapiUrl:', data.crowdsecLapiUrl);
    console.log('crowdsecLapiKey:', data.crowdsecLapiKey ? '[REDACTED]' : 'EMPTY');
    try {
      await generateConfig(
        data.cloudflareToken,
        data.crowdsecLapiUrl,
        data.crowdsecLapiKey,
        sendOutput
      );
    } catch (error) {
      sendOutput({ type: 'error', data: String(error) });
    }
  });

  // Get zones from config
  socket.on('get-zones', async () => {
    try {
      const zones = await getZonesFromConfig();
      socket.emit('zones-loaded', { zones });
    } catch (error) {
      socket.emit('zones-error', { error: String(error) });
    }
  });

  // Update selected zones
  socket.on('update-zones', async (data: { selectedZoneIds: string[] }) => {
    try {
      await updateConfigWithSelectedZones(data.selectedZoneIds);
      socket.emit('zones-updated', { success: true });
    } catch (error) {
      socket.emit('zones-error', { error: String(error) });
    }
  });

  // Deploy in autonomous mode
  socket.on(
    'deploy',
    async (data: { crowdsecLapiUrl: string; crowdsecLapiKey: string }) => {
      console.log('Deploying autonomous bouncer...');
      try {
        await deployAutonomous(
          data.crowdsecLapiUrl,
          data.crowdsecLapiKey,
          sendOutput
        );
      } catch (error) {
        sendOutput({ type: 'error', data: String(error) });
      }
    }
  );

  // Clear infrastructure
  socket.on('clear', async () => {
    console.log('Clearing infrastructure...');
    try {
      await clearInfrastructure(sendOutput);
    } catch (error) {
      sendOutput({ type: 'error', data: String(error) });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
httpServer.listen(serverConfig.port, () => {
  console.log(`Server running on http://localhost:${serverConfig.port}`);
  console.log(`Bouncer binary: ${serverConfig.bouncerBinaryPath}`);
});