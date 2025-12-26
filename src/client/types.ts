export type Action = 'deploy' | 'clear' | null;

export type WizardStep =
  | 'action-select'
  | 'credentials'
  | 'clear-confirm'
  | 'zone-select'
  | 'executing'
  | 'success'
  | 'error';

export interface WizardState {
  step: WizardStep;
  action: Action;
  cloudflareToken: string;
  crowdsecLapiUrl: string;
  crowdsecLapiKey: string;
  selectedZoneIds: string[];
}