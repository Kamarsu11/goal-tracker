import React from 'react';
import './chartConfig';
import { Bar } from 'react-chartjs-2';
import { DailySummary } from '../../types';
import { CATEGORY_DEFINITIONS } from '../../utils/categories';
import { Clock, Maximize2 } from 'lucide-react';

interface TimeDistributionChartProps {
  summaries: DailySummary[];
  onOpenFullscreen?: () => void;
}

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ summaries, onOpenFullscreen }) => {
  const labels = summaries.map(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
  });

  const datasets = [
    {
      label: 'High-Int Tennis',
      data: summaries.map(s => s.highIntensityTennisHours),
      backgroundColor: CATEGORY_DEFINITIONS.tennis_focus.color,
      stack: '24h',
    },
    {
      label: 'Practice Matches',
      data: summaries.map(s => s.practiceMatchHours),
      backgroundColor: CATEGORY_DEFINITIONS.tennis_match.color,
      stack: '24h',
    },
    {
      label: 'Squad Tennis',
      data: summaries.map(s => s.squadTennisHours),
      backgroundColor: CATEGORY_DEFINITIONS.tennis_squad.color,
      stack: '24h',
    },
    {
      label: 'Multisport',
      data: summaries.map(s => s.multisportHours),
      backgroundColor: CATEGORY_DEFINITIONS.multisport.color,
      stack: '24h',
    },
    {
      label: 'S&C Footwork',
      data: summaries.map(s => s.scFootworkHours),
      backgroundColor: CATEGORY_DEFINITIONS.tennis_sc_footwork.color,
      stack: '24h',
    },
    {
      label: 'Pre-hab & Mobility',
      data: summaries.map(s => s.mobilityHours),
      backgroundColor: CATEGORY_DEFINITIONS.mobility_prehab.color,
      stack: '24h',
    },
    {
      label: 'Intentional Rest',
      data: summaries.map(s => s.intentionalRestHours),
      backgroundColor: CATEGORY_DEFINITIONS.intentional_rest.color,
      stack: '24h',
    },
    {
      label: 'Tennis IQ',
      data: summaries.map(s => s.tennisIqHours),
      backgroundColor: CATEGORY_DEFINITIONS.tennis_iq.color,
      stack: '24h',
    },
    {
      label: 'School',
      data: summaries.map(s => s.schoolHours),
      backgroundColor: CATEGORY_DEFINITIONS.school.color,
      stack: '24h',
    },
    {
      label: 'Study / Homework',
      data: summaries.map(s => s.studyHours),
      backgroundColor: CATEGORY_DEFINITIONS.study_homework.color,
      stack: '24h',
    },
    {
      label: 'Transit & Wait',
      data: summaries.map(s => s.transitHours),
      backgroundColor: CATEGORY_DEFINITIONS.transit.color,
      stack: '24h',
    },
    {
      label: 'Guilt-Free Play',
      data: summaries.map(s => s.guiltFreeFunHours),
      backgroundColor: CATEGORY_DEFINITIONS.guilt_free_fun.color,
      stack: '24h',
    },
    {
      label: 'Sleep',
      data: summaries.map(s => s.sleepHours),
      backgroundColor: CATEGORY_DEFINITIONS.sleep.color,
      stack: '24h',
    },
    {
      label: '🔴 Unnoticed Dead Time',
      data: summaries.map(s => s.unnoticedHours),
      backgroundColor: CATEGORY_DEFINITIONS.unnoticed_time.color,
      stack: '24h',
    },
    {
      label: '⚠️ Unlogged Gap',
      data: summaries.map(s => s.unloggedHours),
      backgroundColor: 'rgba(100, 116, 139, 0.4)',
      borderColor: '#64748b',
      borderWidth: 1,
      stack: '24h',
    },
  ];

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { size: 10 },
          boxWidth: 12,
          padding: 8,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const val = context.raw || 0;
            return ` ${context.dataset.label}: ${val.toFixed(2)} hrs`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
      },
      y: {
        stacked: true,
        max: 24,
        title: {
          display: true,
          text: '24 Hours Total',
          color: '#94a3b8',
          font: { size: 10 },
        },
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', stepSize: 4, font: { size: 10 } },
      },
    },
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              24-Hour Daily Time Allocation
            </h3>
            <p className="text-[11px] text-slate-400">
              Stacked daily breakdown: Productive vs Transit vs Sleep vs Unnoticed Wastage
            </p>
          </div>
        </div>

        {onOpenFullscreen && (
          <button
            onClick={onOpenFullscreen}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-tennis-500/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-sm ml-auto"
            title="Fullscreen Interactive View"
          >
            <Maximize2 className="w-3.5 h-3.5 text-tennis-400" />
            <span>Fullscreen</span>
          </button>
        )}
      </div>

      <div className="h-64 sm:h-72 w-full pt-1">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
