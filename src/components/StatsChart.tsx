import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Prediction } from '../types';

interface StatsChartProps {
  history: Prediction[];
}

export const StatsChart: React.FC<StatsChartProps> = ({ history }) => {
  // Prepare data for the chart (reverse to show chronological order left-to-right if history is desc)
  const data = [...history].reverse().map((h) => ({
    name: `No.${h.issue.slice(-3)}`,
    hits: h.hitCount || 0,
    prize: h.prize || 0,
  }));

  return (
    <div className="w-full h-48 bg-white rounded-xl p-2 shadow-inner">
      <p className="text-xs text-gray-500 mb-2 pl-2">近7期命中走势</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#9ca3af' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            hide 
            domain={[0, 'auto']} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
          />
          <Line
            type="monotone"
            dataKey="hits"
            stroke="#e11d48"
            strokeWidth={3}
            dot={{ r: 4, fill: '#e11d48', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};