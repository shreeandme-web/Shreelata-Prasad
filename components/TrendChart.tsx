import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendHistoryData } from '../types';

// Colors for the chart lines, picked for a dark theme
const COLORS = [
  '#22d3ee', // cyan-400
  '#a78bfa', // violet-400
  '#f472b6', // pink-400
  '#4ade80', // green-400
  '#facc15', // yellow-400
];
const SENTIMENT_COLOR = '#fb923c'; // orange-400

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const sentimentPayload = payload.find((p: any) => p.dataKey === 'averageSentiment');
    const volumePayloads = payload.filter((p: any) => p.dataKey !== 'averageSentiment');

    return (
      <div className="bg-slate-900/80 backdrop-blur-sm p-4 border border-slate-700 rounded-lg shadow-lg">
        <p className="label text-slate-300 font-bold">{`Time: ${label}`}</p>
        {volumePayloads.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="intro">
            {`${entry.name}: ${entry.value.toLocaleString()} posts/min`}
          </p>
        ))}
        {sentimentPayload && (
          <p style={{ color: sentimentPayload.color }} className="intro font-semibold mt-2">
            {`Avg. Sentiment: ${sentimentPayload.value.toFixed(1)}`}
          </p>
        )}
      </div>
    );
  }
  return null;
};

interface TrendChartProps {
  data: TrendHistoryData[];
  trackedTrends: string[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data, trackedTrends }) => {
  // Get all unique trend names from the historical data
  const trendKeys = React.useMemo(() => {
    const keys = new Set<string>();
    data.forEach(entry => {
      Object.keys(entry).forEach(key => {
        if (key !== 'time' && key !== 'averageSentiment') {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  }, [data]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
          <YAxis 
            yAxisId="left"
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `${(value as number) / 1000}k`}
            />
           <YAxis 
            yAxisId="right"
            orientation="right"
            stroke={SENTIMENT_COLOR}
            domain={[0, 100]}
            tick={{ fill: SENTIMENT_COLOR, fontSize: 12 }}
            />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          {trendKeys.map((key, index) => {
            const isTracked = trackedTrends.some(t => t.toLowerCase() === key.toLowerCase());
            return (
                <Line
                yAxisId="left"
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 4 }}
                connectNulls
                strokeDasharray={isTracked ? "5 5" : "0"}
                />
            );
          })}
          <Line
            yAxisId="right"
            key="averageSentiment"
            type="monotone"
            dataKey="averageSentiment"
            name="Avg. Sentiment"
            stroke={SENTIMENT_COLOR}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;