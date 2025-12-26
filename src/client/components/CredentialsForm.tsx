import { useState } from 'react';
import { Action } from '../types';

interface CredentialsFormProps {
  action: Action;
  onSubmit: (credentials: {
    cloudflareToken: string;
    crowdsecLapiUrl: string;
    crowdsecLapiKey: string;
  }) => void;
  onBack: () => void;
}

export default function CredentialsForm({
  action,
  onSubmit,
  onBack,
}: CredentialsFormProps) {
  const [cloudflareToken, setCloudflareToken] = useState('');
  const [crowdsecLapiUrl, setCrowdsecLapiUrl] = useState('');
  const [crowdsecLapiKey, setCrowdsecLapiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ cloudflareToken, crowdsecLapiUrl, crowdsecLapiKey });
  };

  const isDeployAction = action === 'deploy';
  const isValid =
    cloudflareToken.trim() !== '' &&
    (!isDeployAction ||
      (crowdsecLapiUrl.trim() !== '' && crowdsecLapiKey.trim() !== ''));

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Enter Credentials
        </h2>
        <p className="text-gray-600">
          {isDeployAction
            ? 'Provide your Cloudflare and CrowdSec credentials'
            : 'Provide your Cloudflare API token'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="cloudflareToken"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cloudflare API Token
            </label>
            <input
              type="password"
              id="cloudflareToken"
              value={cloudflareToken}
              onChange={(e) => setCloudflareToken(e.target.value)}
              className="input-field"
              placeholder="Enter your Cloudflare API token"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Token needs permissions: Zone:Read, Workers:Edit, KV:Edit
            </p>
          </div>

          {isDeployAction && (
            <>
              <hr className="border-gray-200" />

              <div>
                <label
                  htmlFor="crowdsecLapiUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  CrowdSec Blocklist Mirror URL
                </label>
                <input
                  type="url"
                  id="crowdsecLapiUrl"
                  value={crowdsecLapiUrl}
                  onChange={(e) => setCrowdsecLapiUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://admin.api.crowdsec.net/..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Blocklist mirror endpoint from CrowdSec Console
                </p>
              </div>

              <div>
                <label
                  htmlFor="crowdsecLapiKey"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  CrowdSec API Key
                </label>
                <input
                  type="password"
                  id="crowdsecLapiKey"
                  value={crowdsecLapiKey}
                  onChange={(e) => setCrowdsecLapiKey(e.target.value)}
                  className="input-field"
                  placeholder="Enter your CrowdSec API key"
                  required
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button type="button" onClick={onBack} className="btn-secondary flex-1">
            Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="btn-primary flex-1"
          >
            {isDeployAction ? 'Continue' : 'Clear Infrastructure'}
          </button>
        </div>
      </form>
    </div>
  );
}