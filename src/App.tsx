import { challenges } from './data/challenges';
import type { EternityChallenge, DimensionSplit, PaceSplit } from './data/challenges';

const dimensionSplitColors: Record<DimensionSplit, string> = {
  antimatter: 'bg-green-600',
  infinity: 'bg-orange-500',
  time: 'bg-purple-600',
};

const dimensionSplitLabels: Record<DimensionSplit, string> = {
  antimatter: 'AM',
  infinity: 'Inf',
  time: 'Time',
};

const paceSplitColors: Record<PaceSplit, string> = {
  active: 'bg-red-600',
  passive: 'bg-purple-500',
  idle: 'bg-blue-600',
};

const paceSplitLabels: Record<PaceSplit, string> = {
  active: 'Active',
  passive: 'Passive',
  idle: 'Idle',
};

function SplitBadge({
  value,
  colors,
  labels
}: {
  value: DimensionSplit | PaceSplit;
  colors: Record<string, string>;
  labels: Record<string, string>;
}) {
  return (
    <span className={`${colors[value]} text-white text-xs font-bold px-2 py-1 rounded`}>
      {labels[value]}
    </span>
  );
}

function hasSplitVariation(ec: EternityChallenge, splitType: 'dimension' | 'pace'): boolean {
  if (ec.completions.length <= 1) return false;
  const first = splitType === 'dimension'
    ? ec.completions[0].dimensionSplit
    : ec.completions[0].paceSplit;
  return ec.completions.some(c =>
    (splitType === 'dimension' ? c.dimensionSplit : c.paceSplit) !== first
  );
}

function ECCard({ ec }: { ec: EternityChallenge }) {
  const hasDimVariation = hasSplitVariation(ec, 'dimension');
  const hasPaceVariation = hasSplitVariation(ec, 'pace');

  // If no variation, show compact view
  if (!hasDimVariation && !hasPaceVariation) {
    const first = ec.completions[0];
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">EC{ec.id}</h3>
          <div className="flex gap-2">
            <SplitBadge
                            value={first.dimensionSplit}
              colors={dimensionSplitColors}
              labels={dimensionSplitLabels}
            />
            <SplitBadge
                            value={first.paceSplit}
              colors={paceSplitColors}
              labels={paceSplitLabels}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show expanded view with per-completion splits
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-3">EC{ec.id}</h3>
      <div className="space-y-2">
        {ec.completions.map((completion) => (
          <div key={completion.level} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">x{completion.level}</span>
            <div className="flex gap-2">
              <SplitBadge
                                value={completion.dimensionSplit}
                colors={dimensionSplitColors}
                labels={dimensionSplitLabels}
              />
              <SplitBadge
                                value={completion.paceSplit}
                colors={paceSplitColors}
                labels={paceSplitLabels}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">AD Tool</h1>
        <p className="text-gray-400 mb-6">Eternity Challenge Split Reference</p>

        {/* Legend */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="text-gray-400 text-sm block mb-2">Dimension Split (71-103)</span>
              <div className="flex gap-2">
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">AM</span>
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">Inf</span>
                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">Time</span>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-sm block mb-2">Pace Split (121-141)</span>
              <div className="flex gap-2">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Active</span>
                <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">Passive</span>
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Idle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((ec) => (
            <ECCard key={ec.id} ec={ec} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
