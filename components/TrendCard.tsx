import React from 'react';
import { Trend, Sentiment } from '../types';

interface TrendCardProps {
  trend: Trend;
  index: number;
}

const getSentimentClasses = (sentiment: Sentiment) => {
  switch (sentiment) {
    case Sentiment.Positive:
      return {
        text: 'text-green-400',
        progress: 'bg-green-500',
      };
    case Sentiment.Negative:
      return {
        text: 'text-red-400',
        progress: 'bg-red-500',
      };
    default:
      return {
        text: 'text-yellow-400',
        progress: 'bg-yellow-500',
      };
  }
};

const getChangeClasses = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-slate-400';
}

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L13 7.414V17a1 1 0 11-2 0V7.414L7.707 10.707a1 1 0 01-1.414-1.414l4-4z" clipRule="evenodd" />
    </svg>
);


const TrendCard: React.FC<TrendCardProps> = ({ trend, index }) => {
  const sentimentStyle = getSentimentClasses(trend.sentiment);
  const changeStyle = getChangeClasses(trend.change);
  const animationDelay = `${index * 100}ms`;
  const isTracked = trend.isTracked;

  return (
    <a
      href={trend.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View trend ${trend.name} on social media`}
      className={`relative block bg-slate-800 p-5 rounded-xl border hover:bg-slate-700/50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg animate-fade-in group focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
        isTracked 
          ? 'border-violet-500/50 hover:border-violet-400/80' 
          : 'border-slate-700 hover:border-cyan-500/50'
      }`}
      style={{ animationDelay }}
    >
      <div className="absolute -top-3 -left-3 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-slate-900 font-bold text-sm shadow-md border-2 border-slate-800">
        {index + 1}
      </div>

      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-cyan-400 pr-2 group-hover:underline decoration-cyan-500/80 transition">{trend.name}</h3>
        <div className="flex items-center gap-2">
            {isTracked && <PinIcon />}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
        </div>
      </div>
      <p className="text-sm text-slate-400 mt-2">{trend.summary}</p>
      
      <div className="my-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-400">Sentiment</span>
          <span className={`text-sm font-bold ${sentimentStyle.text}`}>{trend.sentiment} ({trend.sentimentScore})</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
                className={`h-2 rounded-full transition-all duration-500 ${sentimentStyle.progress}`} 
                style={{ width: `${trend.sentimentScore}%` }}>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-baseline bg-slate-900/50 p-3 rounded-lg">
        <div>
            <p className="text-xs text-slate-500">Posts / Min</p>
            <p className="text-2xl font-semibold text-cyan-400">
              {(trend.volume / 1000).toFixed(1)}k
            </p>
        </div>
        <div>
            <p className="text-xs text-slate-500 text-right">Change</p>
            <p className={`text-lg font-semibold ${changeStyle}`}>
              {trend.change > 0 ? '+' : ''}{trend.change}
            </p>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </a>
  );
};

export default TrendCard;