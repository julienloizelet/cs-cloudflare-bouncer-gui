import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface CommandOutput {
  type: 'stdout' | 'stderr' | 'exit' | 'error';
  data: string;
  code?: number;
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

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [output, setOutput] = useState<CommandOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [zones, setZones] = useState<ZoneInfo[]>([]);
  const [lastExitCode, setLastExitCode] = useState<number | null>(null);

  useEffect(() => {
    const socket = io(window.location.origin, {
      path: '/socket.io',
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('command-output', (data: CommandOutput) => {
      setOutput((prev) => [...prev, data]);

      if (data.type === 'exit' || data.type === 'error') {
        setIsRunning(false);
        if (data.type === 'exit') {
          setLastExitCode(data.code ?? 0);
        }
      }
    });

    socket.on('zones-loaded', (data: { zones: ZoneInfo[] }) => {
      setZones(data.zones);
    });

    socket.on('zones-updated', () => {
      // Zones updated successfully
    });

    socket.on('zones-error', (data: { error: string }) => {
      setOutput((prev) => [...prev, { type: 'error', data: data.error }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearOutput = useCallback(() => {
    setOutput([]);
    setLastExitCode(null);
  }, []);

  const generateConfig = useCallback((
    cloudflareToken: string,
    crowdsecLapiUrl: string,
    crowdsecLapiKey: string
  ) => {
    if (!socketRef.current) return;
    setIsRunning(true);
    clearOutput();
    socketRef.current.emit('generate-config', {
      cloudflareToken,
      crowdsecLapiUrl,
      crowdsecLapiKey,
    });
  }, [clearOutput]);

  const loadZones = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('get-zones');
  }, []);

  const updateZones = useCallback((selectedZoneIds: string[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        reject(new Error('Socket not connected'));
        return;
      }

      const onUpdated = () => {
        socketRef.current?.off('zones-updated', onUpdated);
        socketRef.current?.off('zones-error', onError);
        resolve();
      };

      const onError = (data: { error: string }) => {
        socketRef.current?.off('zones-updated', onUpdated);
        socketRef.current?.off('zones-error', onError);
        reject(new Error(data.error));
      };

      socketRef.current.on('zones-updated', onUpdated);
      socketRef.current.on('zones-error', onError);
      socketRef.current.emit('update-zones', { selectedZoneIds });
    });
  }, []);

  const deploy = useCallback((crowdsecLapiUrl: string, crowdsecLapiKey: string) => {
    if (!socketRef.current) return;
    setIsRunning(true);
    clearOutput();
    socketRef.current.emit('deploy', { crowdsecLapiUrl, crowdsecLapiKey });
  }, [clearOutput]);

  const clear = useCallback(() => {
    if (!socketRef.current) return;
    setIsRunning(true);
    clearOutput();
    socketRef.current.emit('clear');
  }, [clearOutput]);

  return {
    isConnected,
    output,
    isRunning,
    zones,
    lastExitCode,
    generateConfig,
    loadZones,
    updateZones,
    deploy,
    clear,
    clearOutput,
    setZones,
  };
}