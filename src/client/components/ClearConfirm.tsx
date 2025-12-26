interface ClearConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ClearConfirm({ onConfirm, onCancel }: ClearConfirmProps) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="card text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirm Clear Operation
        </h2>

        <p className="text-gray-600 mb-6">
          This will remove all CrowdSec bouncer infrastructure from your
          Cloudflare account, including:
        </p>

        <ul className="text-left text-gray-600 mb-8 space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            Cloudflare Workers
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            Worker Routes
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            KV Namespaces
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">•</span>
            Turnstile Widgets
          </li>
        </ul>

        <div className="flex gap-4">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger flex-1">
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}