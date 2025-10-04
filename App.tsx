// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Trend, TrendHistoryData, Platform, Category, Country, Region } from './types';
import { fetchSocialTrends } from './services/geminiService';
import { UPDATE_INTERVAL, MAX_HISTORY_LENGTH, PLATFORMS, CATEGORIES, COUNTRIES, G20_REGIONS_MAP } from './constants';
import Header from './components/Header';
import TrendCard from './components/TrendCard';
import TrendChart from './components/TrendChart';
import LoadingSpinner from './components/LoadingSpinner';
import CategoryTabs from './components/CategoryTabs';
import TrackTrend from './components/TrackTrend';

const App: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>('All Platforms');
  const [category, setCategory] = useState<Category>('All');
  const [country, setCountry] = useState<Country>('Worldwide');
  const [region, setRegion] = useState<Region>('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [history, setHistory] = useState<TrendHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [trackedTrends, setTrackedTrends] = useState<string[]>([]);

  const getTrends = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newTrends = await fetchSocialTrends(platform, category, country, region, trackedTrends);
      
      const trendsWithTracking = newTrends.map(trend => ({
        ...trend,
        isTracked: trackedTrends.some(tracked => tracked.toLowerCase() === trend.name.toLowerCase())
      }));

      setTrends(trendsWithTracking);
      
      const now = new Date();
      setLastUpdated(now);

      const totalSentiment = newTrends.reduce((acc, trend) => acc + trend.sentimentScore, 0);
      const averageSentiment = newTrends.length > 0 ? totalSentiment / newTrends.length : 50;

      setHistory(prevHistory => {
        const newHistoryEntry: TrendHistoryData = {
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          averageSentiment: averageSentiment,
        };
        newTrends.forEach(trend => {
          newHistoryEntry[trend.name] = trend.volume;
        });
        
        const updatedHistory = [...prevHistory, newHistoryEntry];
        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
          return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH);
        }
        return updatedHistory;
      });

    } catch (err) {
      console.error("Error fetching social trends:", err);
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [platform, category, country, region, trackedTrends]);

  useEffect(() => {
    getTrends();
    const intervalId = setInterval(getTrends, UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [getTrends]);

  const handlePlatformChange = (newPlatform: Platform) => {
    setPlatform(newPlatform);
    setTrends([]);
    setHistory([]);
    setLastUpdated(null);
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setTrends([]);
    setHistory([]);
    setLastUpdated(null);
  };
  
  const handleCountryChange = (newCountry: Country) => {
    setCountry(newCountry);
    setRegion(''); // Reset region when country changes
    setTrends([]);
    setHistory([]);
    setLastUpdated(null);
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    setTrends([]);
    setHistory([]);
    setLastUpdated(null);
  };

  const handleTrackTrend = (trendName: string) => {
    if (trendName && !trackedTrends.find(t => t.toLowerCase() === trendName.toLowerCase())) {
        setTrackedTrends(prev => [...prev, trendName]);
        setTrends([]);
        setHistory([]);
        setLastUpdated(null);
    }
  };

  const handleUntrackTrend = (trendName: string) => {
      setTrackedTrends(prev => prev.filter(t => t.toLowerCase() !== trendName.toLowerCase()));
      setTrends([]);
      setHistory([]);
      setLastUpdated(null);
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          lastUpdated={lastUpdated} 
          isLoading={isLoading}
          platforms={PLATFORMS}
          selectedPlatform={platform}
          onPlatformChange={handlePlatformChange}
          countries={COUNTRIES}
          selectedCountry={country}
          onCountryChange={handleCountryChange}
          regions={G20_REGIONS_MAP[country] || []}
          selectedRegion={region}
          onRegionChange={handleRegionChange}
          onRefresh={getTrends}
        />

        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
        />

        <TrackTrend 
            trackedTrends={trackedTrends}
            onTrack={handleTrackTrend}
            onUntrack={handleUntrackTrend}
        />

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-2xl shadow-slate-950/50">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Trend Volume (Last 10 Mins on {platform})</h2>
            {history.length > 0 ? (
              <TrendChart data={history} trackedTrends={trackedTrends} />
            ) : (
               <div className="flex items-center justify-center h-96 text-slate-500">
                  {isLoading ? 'Loading chart data...' : 'Not enough data for chart yet.'}
               </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
             <h2 className="text-xl font-bold text-cyan-400">Current Hot Topics in {category}</h2>
             {isLoading && trends.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
             ) : error ? (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                    <p className="font-bold">An Error Occurred</p>
                    <p>{error}</p>
                </div>
             ) : (
                trends.map((trend, index) => (
                    <TrendCard key={trend.name} trend={trend} index={index} />
                ))
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;