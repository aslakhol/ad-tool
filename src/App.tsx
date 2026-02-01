import { useState } from 'react';
import { challenges } from './data/challenges';
import type { EternityChallenge, ECCompletion, DimensionSplit, PaceSplit } from './data/challenges';

const dimensionColors: Record<DimensionSplit, { bg: string; text: string }> = {
  antimatter: { bg: 'bg-green-500', text: 'text-green-400' },
  infinity: { bg: 'bg-orange-500', text: 'text-orange-400' },
  time: { bg: 'bg-purple-500', text: 'text-purple-400' },
};

const dimensionLabels: Record<DimensionSplit, string> = {
  antimatter: 'Antimatter',
  infinity: 'Infinity',
  time: 'Time',
};

const paceColors: Record<PaceSplit, { bg: string; text: string }> = {
  active: { bg: 'bg-red-500', text: 'text-red-400' },
  passive: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-400' },
  idle: { bg: 'bg-sky-500', text: 'text-sky-400' },
};

const paceLabels: Record<PaceSplit, string> = {
  active: 'Active',
  passive: 'Passive',
  idle: 'Idle',
};

function CompletionDots({
  values,
  colorMap
}: {
  values: (DimensionSplit | PaceSplit)[];
  colorMap: Record<string, { bg: string }>;
}) {
  return (
    <div className="flex gap-1">
      {values.map((value, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${colorMap[value].bg}`}
          title={`x${i + 1}`}
        />
      ))}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 transition-colors"
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}

function CompletionRow({ completion }: { completion: ECCompletion }) {
  const hasNote = completion.notes && completion.notes !== '-';
  const tsString = completion.timeStudies.join(',');

  return (
    <div className="flex items-center gap-3 py-2 px-3 bg-gray-800/50 rounded">
      <span className="text-sm text-gray-400 w-8 shrink-0">x{completion.level}</span>
      <div className="text-sm flex-1 min-w-0">
        {hasNote ? (
          <span className="text-gray-300">{completion.notes}</span>
        ) : (
          <span className="text-gray-600">—</span>
        )}
      </div>
      <div className="text-sm shrink-0">
        {completion.tt ? (
          <span className="text-amber-400">{completion.tt} TT</span>
        ) : (
          <span className="text-gray-600">—</span>
        )}
      </div>
      <CopyButton text={tsString} label="Copy TS" />
    </div>
  );
}

function ECRow({ ec, isExpanded, onToggle }: {
  ec: EternityChallenge;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const dimSplits = ec.completions.map(c => c.dimensionSplit);
  const paceSplits = ec.completions.map(c => c.paceSplit);

  const dimUnique = [...new Set(dimSplits)];
  const paceUnique = [...new Set(paceSplits)];

  const hasDimVariation = dimUnique.length > 1;
  const hasPaceVariation = paceUnique.length > 1;

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Main row - clickable */}
      <div
        onClick={onToggle}
        className={`flex items-center gap-3 py-3 px-4 cursor-pointer transition-colors ${
          isExpanded ? 'bg-gray-800' : 'bg-gray-800/50 hover:bg-gray-800/70'
        }`}
      >
        {/* EC Number */}
        <div className="text-xl font-bold text-white w-14 shrink-0">
          EC{ec.id}
        </div>

        {/* Splits container - stacks on mobile */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
          {/* Dimension Split */}
          <div className="flex items-center gap-2 min-w-0">
            {hasDimVariation ? (
              <>
                <CompletionDots values={dimSplits} colorMap={dimensionColors} />
                <span className="text-sm text-gray-400 truncate">
                  {dimUnique.map(d => dimensionLabels[d]).join(' → ')}
                </span>
              </>
            ) : (
              <span className={`text-sm font-medium ${dimensionColors[dimSplits[0]].text}`}>
                {dimensionLabels[dimSplits[0]]}
              </span>
            )}
          </div>

          {/* Pace Split */}
          <div className="flex items-center gap-2 min-w-0">
            {hasPaceVariation ? (
              <>
                <CompletionDots values={paceSplits} colorMap={paceColors} />
                <span className="text-sm text-gray-400 truncate">
                  {paceUnique.map(p => paceLabels[p]).join(' → ')}
                </span>
              </>
            ) : (
              <span className={`text-sm font-medium ${paceColors[paceSplits[0]].text}`}>
                {paceLabels[paceSplits[0]]}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div className={`text-gray-500 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.293 5.293a1 1 0 011.414 0L8 7.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="bg-gray-900 border-t border-gray-700 px-4 py-3">
          <div className="hidden sm:flex gap-3 px-3 mb-2 text-xs text-gray-500 uppercase tracking-wide">
            <div className="w-8">Level</div>
            <div className="flex-1">Notes</div>
            <div>TT Req</div>
            <div className="w-16"></div>
          </div>
          <div className="space-y-1">
            {ec.completions.map((completion) => (
              <CompletionRow key={completion.level} completion={completion} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-3 text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-gray-500 uppercase text-xs tracking-wide">Dimension</span>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-gray-300">Antimatter</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-gray-300">Infinity</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-gray-300">Time</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-gray-500 uppercase text-xs tracking-wide">Pace</span>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-gray-300">Active</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
            <span className="text-gray-300">Passive</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-gray-300">Idle</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">AD Tool</h1>
          <p className="text-gray-500">Eternity Challenge Split Reference</p>
        </header>

        {/* Legend */}
        <div className="mb-6 pb-6 border-b border-gray-800">
          <Legend />
        </div>

        {/* Table Header - hidden on mobile where layout stacks */}
        <div className="hidden sm:flex gap-3 px-4 mb-2 text-xs text-gray-500 uppercase tracking-wide">
          <div className="w-14 shrink-0">EC</div>
          <div className="flex-1 flex gap-6">
            <div>Dimension</div>
            <div>Pace</div>
          </div>
          <div className="w-4"></div>
        </div>

        {/* Challenge List */}
        <div className="space-y-2">
          {challenges.map((ec) => (
            <ECRow
              key={ec.id}
              ec={ec}
              isExpanded={expandedId === ec.id}
              onToggle={() => handleToggle(ec.id)}
            />
          ))}
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-gray-600 text-center">
          Click a challenge to see details • Dots show x1→x5 splits when they vary
        </p>
      </div>
    </div>
  );
}

export default App;
