export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CS</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              CrowdSec Cloudflare Bouncer
            </h1>
            <p className="text-sm text-gray-500">Autonomous Mode Setup</p>
          </div>
        </div>
      </div>
    </header>
  );
}
