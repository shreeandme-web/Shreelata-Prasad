import React, { useState } from 'react';

interface TrackTrendProps {
  trackedTrends: string[];
  onTrack: (trendName: string) => void;
  onUntrack: (trendName: string) => void;
}

const TrackTrend: React.FC<TrackTrendProps> = ({ trackedTrends, onTrack, onUntrack }) => {
  const [inputValue, setInputValue] = useState('');

  const handleTrack = () => {
    if (inputValue.trim()) {
      onTrack(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  return (
    <div className="my-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
      <h2 className="text-lg font-bold text-violet-400 mb-4">Track a specific trend</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a trend, e.g., #FutureOfAI"
          className="flex-grow bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block p-2.5 transition"
          aria-label="Track a new trend"
        />
        <button
          onClick={handleTrack}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200"
        >
          Track
        </button>
      </div>
      {trackedTrends.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-slate-400 mb-2">Currently tracking:</p>
          <div className="flex flex-wrap gap-2">
            {trackedTrends.map(trend => (
              <div key={trend} className="flex items-center bg-slate-700 text-slate-200 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                <span>{trend}</span>
                <button 
                  onClick={() => onUntrack(trend)}
                  className="ml-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-full p-0.5 transition"
                  aria-label={`Stop tracking ${trend}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackTrend;
