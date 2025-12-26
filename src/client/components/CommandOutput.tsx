import { useEffect, useRef } from 'react';
import { CommandOutput as CommandOutputType } from '../hooks/useSocket';

interface CommandOutputProps {
  output: CommandOutputType[];
  isRunning: boolean;
}

export default function CommandOutput({ output, isRunning }: CommandOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          {isRunning && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
          <h3 className="text-lg font-semibold text-gray-800">
            {isRunning ? 'Executing...' : 'Output'}
          </h3>
        </div>

        <div
          ref={containerRef}
          className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto"
        >
          {output.length === 0 ? (
            <div className="text-gray-500">Waiting for output...</div>
          ) : (
            output.map((line, index) => (
              <div
                key={index}
                className={`whitespace-pre-wrap ${
                  line.type === 'stderr'
                    ? 'text-yellow-400'
                    : line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'exit'
                    ? line.code === 0
                      ? 'text-green-400'
                      : 'text-red-400'
                    : 'text-gray-100'
                }`}
              >
                {line.type === 'exit'
                  ? `\nProcess exited with code ${line.code}`
                  : line.data}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}