// components/Header.tsx
import React from 'react';
import { Platform, Country, Region } from '../types';

interface HeaderProps {
    lastUpdated: Date | null;
    isLoading: boolean;
    platforms: Platform[];
    selectedPlatform: Platform;
    onPlatformChange: (platform: Platform) => void;
    countries: Country[];
    selectedCountry: Country;
    onCountryChange: (country: Country) => void;
    regions: string[]; // Generic list of regions
    selectedRegion: Region;
    onRegionChange: (region: Region) => void;
    onRefresh: () => void;
}

const PulseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h4l2-4 2 4h4l2-4 2 4M4 16h4l2 4 2-4h4l2 4 2-4" />
    </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-4 w-4"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ 
    lastUpdated, 
    isLoading, 
    platforms, 
    selectedPlatform, 
    onPlatformChange, 
    countries,
    selectedCountry,
    onCountryChange,
    regions,
    selectedRegion,
    onRegionChange,
    onRefresh 
}) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
        <div className="flex items-center gap-4">
          <PulseIcon />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Social Pulse</h1>
            <p className="text-slate-400">Real-time Social Media Trend Analysis</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
          <label htmlFor="platform-select" className="sr-only">Select Platform</label>
          <select
            id="platform-select"
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value as Platform)}
            className="w-full sm:w-auto bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
            aria-label="Select a social media platform to track trends"
          >
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <label htmlFor="country-select" className="sr-only">Select Country</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value as Country)}
            className="w-full sm:w-auto bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
            aria-label="Select a country to track trends"
          >
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {regions.length > 0 && (
            <>
              <label htmlFor="region-select" className="sr-only">Select Region</label>
              <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value as Region)}
                className="w-full sm:w-auto bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition"
                aria-label={`Select a region in ${selectedCountry} to track trends`}
              >
                <option value="">All {selectedCountry}</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 sm:mt-0 self-end sm:self-center">
        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
            <div className="relative flex h-3 w-3">
            {isLoading ? (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            ) : (
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
            </div>
            <span className="text-sm text-slate-400">
            {isLoading ? 'Updating...' : `Last updated: ${lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A'}`}
            </span>
        </div>
        <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 px-3 py-2 rounded-lg border border-slate-600 transition-colors"
            aria-label="Refresh trends"
        >
            <RefreshIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
