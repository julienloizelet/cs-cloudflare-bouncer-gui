import type { Action } from '../types';

interface ActionSelectProps {
  onSelect: (action: Action) => void;
}

export default function ActionSelect({ onSelect }: ActionSelectProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          What would you like to do?
        </h2>
        <p className="text-gray-600">
          Choose an action to manage your Cloudflare Worker bouncer
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('deploy')}
          className="card hover:shadow-xl transition-shadow cursor-pointer text-left group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Deploy</h3>
          <p className="text-gray-600">
            Set up the autonomous bouncer infrastructure on your Cloudflare
            zones. This will deploy workers and configure KV storage.
          </p>
        </button>

        <button
          onClick={() => onSelect('clear')}
          className="card hover:shadow-xl transition-shadow cursor-pointer text-left group"
        >
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Clear</h3>
          <p className="text-gray-600">
            Remove all deployed bouncer infrastructure from your Cloudflare
            account. This will delete workers, routes, and KV namespaces.
          </p>
        </button>
      </div>
    </div>
  );
}
