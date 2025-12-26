import type { Action } from '../types';

interface SuccessScreenProps {
  action: Action;
  onReset: () => void;
}

export default function SuccessScreen({ action, onReset }: SuccessScreenProps) {
  const isDeploy = action === 'deploy';

  return (
    <div className="max-w-lg mx-auto">
      <div className="card text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {isDeploy ? 'Deployment Successful!' : 'Infrastructure Cleared!'}
        </h2>

        <p className="text-gray-600 mb-8">
          {isDeploy
            ? 'Your CrowdSec Cloudflare bouncer is now running in autonomous mode. It will automatically sync decisions and protect your zones.'
            : 'All CrowdSec bouncer infrastructure has been removed from your Cloudflare account.'}
        </p>

        {isDeploy && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• The bouncer will sync decisions every 5 minutes</li>
              <li>• Check your Cloudflare dashboard to verify workers are running</li>
              <li>• Monitor your CrowdSec console for blocked requests</li>
            </ul>
          </div>
        )}

        <button onClick={onReset} className="btn-primary">
          Start Over
        </button>
      </div>
    </div>
  );
}
