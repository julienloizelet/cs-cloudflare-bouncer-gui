import { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import type { Action, WizardStep, WizardState } from './types';
import ActionSelect from './components/ActionSelect';
import CredentialsForm from './components/CredentialsForm';
import ClearConfirm from './components/ClearConfirm';
import ZoneSelect from './components/ZoneSelect';
import CommandOutput from './components/CommandOutput';
import SuccessScreen from './components/SuccessScreen';
import Header from './components/Header';

const initialState: WizardState = {
  step: 'action-select',
  action: null,
  cloudflareToken: '',
  crowdsecLapiUrl: '',
  crowdsecLapiKey: '',
  selectedZoneIds: [],
};

export default function App() {
  const [state, setState] = useState<WizardState>(initialState);
  const [initialSelectionDone, setInitialSelectionDone] = useState(false);
  const socket = useSocket();

  // Watch for command completion
  useEffect(() => {
    if (state.step === 'executing' && !socket.isRunning && socket.lastExitCode !== null) {
      if (socket.lastExitCode === 0) {
        // If we just generated config, move to zone selection
        if (state.action === 'deploy' && state.selectedZoneIds.length === 0) {
          socket.loadZones();
          setState((s) => ({ ...s, step: 'zone-select' }));
        } else {
          setState((s) => ({ ...s, step: 'success' }));
        }
      } else {
        setState((s) => ({ ...s, step: 'error' }));
      }
    }
  }, [socket.isRunning, socket.lastExitCode, state.step, state.action, state.selectedZoneIds.length, socket]);

  // Auto-select all zones when they are first loaded (only once per wizard session)
  useEffect(() => {
    if (socket.zones.length > 0 && !initialSelectionDone) {
      setInitialSelectionDone(true);
      setState((s) => ({
        ...s,
        selectedZoneIds: socket.zones.map((z) => z.id),
      }));
    }
  }, [socket.zones, initialSelectionDone]);

  const handleActionSelect = (action: Action) => {
    setState((s) => ({ ...s, action, step: 'credentials' }));
  };

  const handleCredentialsSubmit = (credentials: {
    cloudflareToken: string;
    crowdsecLapiUrl: string;
    crowdsecLapiKey: string;
  }) => {
    setState((s) => ({
      ...s,
      ...credentials,
    }));

    if (state.action === 'clear') {
      setState((s) => ({ ...s, step: 'clear-confirm' }));
    } else {
      // Deploy flow: generate config first (with Lapi credentials)
      setState((s) => ({ ...s, step: 'executing' }));
      socket.generateConfig(
        credentials.cloudflareToken,
        credentials.crowdsecLapiUrl,
        credentials.crowdsecLapiKey
      );
    }
  };

  const handleClearConfirm = () => {
    setState((s) => ({ ...s, step: 'executing' }));
    socket.clear();
  };

  const handleClearCancel = () => {
    setState(initialState);
  };

  const handleZoneSelectionChange = (zoneIds: string[]) => {
    setState((s) => ({ ...s, selectedZoneIds: zoneIds }));
  };

  const handleDeploy = async () => {
    socket.clearOutput(); // Clear previous exit code before changing step
    setState((s) => ({ ...s, step: 'executing' }));
    try {
      await socket.updateZones(state.selectedZoneIds);
      socket.deploy(state.crowdsecLapiUrl, state.crowdsecLapiKey);
    } catch (_error) {
      setState((s) => ({ ...s, step: 'error' }));
    }
  };

  const handleBack = () => {
    const stepOrder: WizardStep[] = [
      'action-select',
      'credentials',
      'clear-confirm',
      'zone-select',
    ];
    const currentIndex = stepOrder.indexOf(state.step);
    if (currentIndex > 0) {
      setState((s) => ({ ...s, step: stepOrder[currentIndex - 1] }));
    }
  };

  const handleReset = () => {
    socket.clearOutput();
    socket.setZones([]);
    setInitialSelectionDone(false);
    setState(initialState);
  };

  const renderStep = () => {
    switch (state.step) {
      case 'action-select':
        return <ActionSelect onSelect={handleActionSelect} />;

      case 'credentials':
        return state.action && (
          <CredentialsForm
            action={state.action}
            onSubmit={handleCredentialsSubmit}
            onBack={handleBack}
          />
        );

      case 'clear-confirm':
        return (
          <ClearConfirm
            onConfirm={handleClearConfirm}
            onCancel={handleClearCancel}
          />
        );

      case 'zone-select':
        return (
          <ZoneSelect
            zones={socket.zones}
            zonesLoading={socket.zonesLoading}
            selectedIds={state.selectedZoneIds}
            onSelectionChange={handleZoneSelectionChange}
            onDeploy={handleDeploy}
            onBack={handleBack}
          />
        );

      case 'executing':
        return (
          <CommandOutput
            output={socket.output}
            isRunning={socket.isRunning}
          />
        );

      case 'success':
        return state.action && (
          <SuccessScreen
            action={state.action}
            onReset={handleReset}
          />
        );

      case 'error':
        return (
          <div className="card max-w-2xl mx-auto text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Operation Failed
            </h2>
            <p className="text-gray-600 mb-6">
              An error occurred. Check the output below for details.
            </p>
            <CommandOutput output={socket.output} isRunning={false} />
            <button onClick={handleReset} className="btn-primary mt-6">
              Start Over
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderStep()}
      </main>
    </div>
  );
}
