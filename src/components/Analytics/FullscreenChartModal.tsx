import React, { useRef, useState } from 'react';
import './chartConfig';
import { Line, Radar, Bar } from 'react-chartjs-2';
import { DailySummary, ChildProfile } from '../../types';
import { CATEGORY_DEFINITIONS } from '../../utils/categories';
import { AGE_BENCHMARKS } from '../../utils/defaultSchedules';
import { X, RotateCcw, ZoomIn, Sparkles, Clock } from 'lucide-react';

export type ChartModalType = 'trajectory' | 'radar' | 'distribution';

interface FullscreenChartModalProps {
  isOpen: boolean;
  chartType?: ChartModalType;
  onClose: () => void;
  k1Summaries: DailySummary[];
  k2Summaries: DailySummary[];
  profile1: ChildProfile;
  profile2?: ChildProfile;
  showBothKids: boolean;
}

export const FullscreenChartModal: React.FC<FullscreenChartModalProps> = ({
  isOpen,
  chartType = 'trajectory',
  onClose,
  k1Summaries,
  k2Summaries,
  profile1,
  profile2,
  showBothKids,
}) => {
  const chartRef = useRef<any>(null);
  const [displayMode, setDisplayMode] = useState<'points' | 'normalized'>('points');

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const confirmedSummaries = k1Summaries.filter(s => s.status === 'confirmed' || s.status === 'sick');
  const benchmark = AGE_BENCHMARKS[profile1.age] || AGE_BENCHMARKS[11];
  const periodFactor = (k1Summaries.length || 1) / 7;

  // Day labels
  const labels = k1Summaries.map(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  // 1. Trajectory calculations
  let cumIdeal1 = 0;
  const idealData1 = k1Summaries.map(s => {
    cumIdeal1 += s.idealScoreTarget;
    return parseFloat(cumIdeal1.toFixed(2));
  });

  let cumIdeal2 = 0;
  const idealData2 = k2Summaries.map(s => {
    cumIdeal2 += s.idealScoreTarget;
    return parseFloat(cumIdeal2.toFixed(2));
  });

  let cumK1 = 0;
  const k1Data = k1Summaries.map(s => {
    if (s.date > todayStr || s.status === 'unlogged') return null;
    if (s.status === 'confirmed' || s.status === 'sick') {
      cumK1 += s.effectiveTennisScore;
      return parseFloat(cumK1.toFixed(2));
    }
    return null;
  });

  let cumK2 = 0;
  const k2Data = k2Summaries.map(s => {
    if (s.date > todayStr || s.status === 'unlogged') return null;
    if (s.status === 'confirmed' || s.status === 'sick') {
      cumK2 += s.effectiveTennisScore;
      return parseFloat(cumK2.toFixed(2));
    }
    return null;
  });

  const normIdeal = k1Summaries.map(() => 100);
  const normK1 = k1Data.map((val, idx) => {
    if (val === null) return null;
    const target = idealData1[idx] || 1;
    return target > 0 ? parseFloat(((val / target) * 100).toFixed(1)) : 100;
  });
  const normK2 = k2Data.map((val, idx) => {
    if (val === null) return null;
    const target = idealData2[idx] || 1;
    return target > 0 ? parseFloat(((val / target) * 100).toFixed(1)) : 100;
  });

  // 2. Radar calculations (elapsed days up to and including today)
  const elapsedSummaries = k1Summaries.filter(s => s.date <= todayStr);
  const effectiveRadarSummaries = elapsedSummaries.length > 0 ? elapsedSummaries : k1Summaries;
  const radarConfirmed = effectiveRadarSummaries.filter(s => s.status === 'confirmed' || s.status === 'sick');
  const radarPeriodFactor = effectiveRadarSummaries.length / 7;

  const actTennis = radarConfirmed.reduce((a, b) => a + b.tennisHours, 0);
  const actMulti = radarConfirmed.reduce((a, b) => a + b.multisportHours, 0);
  const actSC = radarConfirmed.reduce((a, b) => a + b.scFootworkHours, 0);
  const actPrehab = radarConfirmed.reduce((a, b) => a + b.mobilityHours, 0);
  const actIQ = radarConfirmed.reduce((a, b) => a + b.tennisIqHours, 0);
  const actRest = radarConfirmed.reduce((a, b) => a + b.intentionalRestHours, 0);
  const actSleep = radarConfirmed.reduce((a, b) => a + b.sleepHours, 0);

  const targetTennis = (benchmark.weeklyTargets.highIntensityTennisHours + benchmark.weeklyTargets.practiceMatchHours + benchmark.weeklyTargets.squadPracticeHours) * radarPeriodFactor;
  const targetMulti = benchmark.weeklyTargets.multisportHours * radarPeriodFactor;
  const targetSC = benchmark.weeklyTargets.scFootworkHours * radarPeriodFactor;
  const targetPrehab = benchmark.weeklyTargets.prehabHours * radarPeriodFactor;
  const targetIQ = benchmark.weeklyTargets.tennisIqHours * radarPeriodFactor;
  const targetRest = benchmark.weeklyTargets.intentionalRestHours * radarPeriodFactor;
  const targetSleep = (benchmark.weeklyTargets.sleepHoursPerNight * 7) * radarPeriodFactor;

  const pctTennis = targetTennis > 0 ? Math.min(150, Math.round((actTennis / targetTennis) * 100)) : 100;
  const pctMulti = targetMulti > 0 ? Math.min(150, Math.round((actMulti / targetMulti) * 100)) : 100;
  const pctSC = targetSC > 0 ? Math.min(150, Math.round((actSC / targetSC) * 100)) : 100;
  const pctPrehab = targetPrehab > 0 ? Math.min(150, Math.round((actPrehab / targetPrehab) * 100)) : 100;
  const pctIQ = targetIQ > 0 ? Math.min(150, Math.round((actIQ / targetIQ) * 100)) : 100;
  const pctRest = targetRest > 0 ? Math.min(150, Math.round((actRest / targetRest) * 100)) : 100;
  const pctSleep = targetSleep > 0 ? Math.min(150, Math.round((actSleep / targetSleep) * 100)) : 100;

  const handleReset = () => {
    if (chartRef.current) chartRef.current.resetZoom();
  };

  // Render chart body based on active chartType
  const renderChart = () => {
    if (chartType === 'trajectory') {
      let datasets: any[] = [];
      if (displayMode === 'normalized') {
        datasets = [
          {
            label: '⭐ 100% Age Milestone Benchmark',
            data: normIdeal,
            borderColor: '#38bdf8',
            borderWidth: 2.5,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
          },
          {
            label: `🎾 ${profile1.name} (% of Age ${profile1.age} Target)`,
            data: normK1,
            borderColor: '#ccff00',
            backgroundColor: 'rgba(204, 255, 0, 0.15)',
            borderWidth: 4,
            pointRadius: 5,
            pointBackgroundColor: '#ccff00',
            fill: false,
            tension: 0.2,
          },
        ];
        if (showBothKids && profile2) {
          datasets.push({
            label: `🎾 ${profile2.name} (% of Age ${profile2.age} Target)`,
            data: normK2,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            borderWidth: 4,
            pointRadius: 5,
            pointBackgroundColor: '#06b6d4',
            fill: false,
            tension: 0.2,
            spanGaps: true,
          });
        }
      } else {
        datasets = [
          {
            label: `⭐ Ideal Pro Target (${profile1.age}yo Benchmark)`,
            data: idealData1,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            borderWidth: 3.5,
            borderDash: [6, 4],
            pointRadius: 3,
            fill: true,
            tension: 0.3,
          },
          {
            label: `🎾 ${profile1.name} (Actual Score)`,
            data: k1Data,
            borderColor: '#ccff00',
            backgroundColor: 'rgba(204, 255, 0, 0.2)',
            borderWidth: 4,
            pointRadius: 5,
            pointBackgroundColor: '#ccff00',
            fill: false,
            tension: 0.2,
            spanGaps: true,
          },
        ];
        if (showBothKids && profile2) {
          datasets.push({
            label: `⭐ Ideal Pro Target (${profile2.age}yo Benchmark)`,
            data: idealData2,
            borderColor: '#818cf8',
            borderWidth: 2.5,
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false,
          });
          datasets.push({
            label: `🎾 ${profile2.name} (Actual Score)`,
            data: k2Data,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            borderWidth: 3.5,
            pointRadius: 5,
            pointBackgroundColor: '#06b6d4',
            fill: false,
            tension: 0.2,
            spanGaps: true,
          });
        }
      }

      const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#f8fafc', font: { size: 13, weight: 'bold' }, padding: 16 },
          },
          zoom: {
            pan: { enabled: true, mode: 'x' },
            zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
          },
          tooltip: { backgroundColor: '#0f172a', titleFont: { size: 14 }, bodyFont: { size: 13 }, padding: 12 },
        },
        scales: {
          x: { grid: { color: 'rgba(51, 65, 85, 0.4)' }, ticks: { color: '#cbd5e1', font: { size: 12 } } },
          y: {
            title: { display: true, text: 'Cumulative Score', color: '#cbd5e1', font: { size: 13, weight: 'bold' } },
            grid: { color: 'rgba(51, 65, 85, 0.4)' },
            ticks: { color: '#cbd5e1', font: { size: 12 } },
          },
        },
      };

      return <Line ref={chartRef} data={{ labels, datasets }} options={options} />;
    }

    if (chartType === 'radar') {
      const radarData = {
        labels: [
          '🎾 Tennis Volume',
          '🥋 Multisport Power',
          '⚡ S&C & Footwork',
          '🧘 Pre-hab & Mobility',
          '🧠 Tennis IQ',
          '🛌 Intentional Rest',
          '😴 Sleep Recovery',
        ],
        datasets: [
          {
            label: `⭐ Ideal Pro Target Shape (100% Symmetrical)`,
            data: [100, 100, 100, 100, 100, 100, 100],
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            borderWidth: 2.5,
            borderDash: [4, 4],
            pointRadius: 4,
            pointBackgroundColor: '#38bdf8',
          },
          {
            label: `🎾 ${profile1.name} (Actual Distribution)`,
            data: [pctTennis, pctMulti, pctSC, pctPrehab, pctIQ, pctRest, pctSleep],
            borderColor: profile1.id === 'kid1' ? '#84cc16' : '#06b6d4',
            backgroundColor: profile1.id === 'kid1' ? 'rgba(132, 204, 22, 0.3)' : 'rgba(6, 182, 212, 0.3)',
            borderWidth: 4,
            pointRadius: 6,
            pointBackgroundColor: profile1.id === 'kid1' ? '#84cc16' : '#06b6d4',
          },
        ],
      };
      const radarOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'point',
          intersect: true,
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(51, 65, 85, 0.4)' },
            grid: { color: 'rgba(51, 65, 85, 0.4)' },
            suggestedMin: 0,
            suggestedMax: 120,
            ticks: { stepSize: 25, color: '#94a3b8', backdropColor: 'transparent', font: { size: 11 } },
            pointLabels: { color: '#e2e8f0', font: { size: 13, weight: 'bold' } },
          },
        },
        plugins: {
          legend: { position: 'top', labels: { color: '#cbd5e1', font: { size: 13, weight: '600' }, padding: 16 } },
          tooltip: {
            backgroundColor: '#0f172a',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              title: (items: any) => {
                if (!items || items.length === 0) return '';
                if (items.length === 1) return items[0].label;
                const uniqueLabels = Array.from(new Set(items.map((i: any) => i.label)));
                if (uniqueLabels.length === 1) return uniqueLabels[0];
                return 'Training Pillars';
              },
              label: (context: any) => {
                const categoryName = context.label || '';
                return ` ${categoryName} (${context.dataset.label}): ${context.raw}% of Target`;
              },
            },
          },
        },
      };
      return <Radar ref={chartRef} data={radarData} options={radarOptions} />;
    }

    if (chartType === 'distribution') {
      const distData = {
        labels,
        datasets: [
          { label: 'High-Int Tennis', data: k1Summaries.map(s => s.highIntensityTennisHours), backgroundColor: CATEGORY_DEFINITIONS.tennis_focus.color, stack: '24h' },
          { label: 'Practice Matches', data: k1Summaries.map(s => s.practiceMatchHours), backgroundColor: CATEGORY_DEFINITIONS.tennis_match.color, stack: '24h' },
          { label: 'Squad Tennis', data: k1Summaries.map(s => s.squadTennisHours), backgroundColor: CATEGORY_DEFINITIONS.tennis_squad.color, stack: '24h' },
          { label: 'Multisport', data: k1Summaries.map(s => s.multisportHours), backgroundColor: CATEGORY_DEFINITIONS.multisport.color, stack: '24h' },
          { label: 'S&C Footwork', data: k1Summaries.map(s => s.scFootworkHours), backgroundColor: CATEGORY_DEFINITIONS.tennis_sc_footwork.color, stack: '24h' },
          { label: 'Pre-hab & Mobility', data: k1Summaries.map(s => s.mobilityHours), backgroundColor: CATEGORY_DEFINITIONS.mobility_prehab.color, stack: '24h' },
          { label: 'Intentional Rest', data: k1Summaries.map(s => s.intentionalRestHours), backgroundColor: CATEGORY_DEFINITIONS.intentional_rest.color, stack: '24h' },
          { label: 'Tennis IQ', data: k1Summaries.map(s => s.tennisIqHours), backgroundColor: CATEGORY_DEFINITIONS.tennis_iq.color, stack: '24h' },
          { label: 'School', data: k1Summaries.map(s => s.schoolHours), backgroundColor: CATEGORY_DEFINITIONS.school.color, stack: '24h' },
          { label: 'Study / Homework', data: k1Summaries.map(s => s.studyHours), backgroundColor: CATEGORY_DEFINITIONS.study_homework.color, stack: '24h' },
          { label: 'Transit & Wait', data: k1Summaries.map(s => s.transitHours), backgroundColor: CATEGORY_DEFINITIONS.transit.color, stack: '24h' },
          { label: 'Sleep & Recovery', data: k1Summaries.map(s => s.sleepHours), backgroundColor: CATEGORY_DEFINITIONS.sleep.color, stack: '24h' },
          { label: 'Fun & Play', data: k1Summaries.map(s => s.guiltFreeFunHours), backgroundColor: CATEGORY_DEFINITIONS.guilt_free_fun.color, stack: '24h' },
          { label: 'Dead Time / Idle', data: k1Summaries.map(s => s.deadTimeHours || 0), backgroundColor: CATEGORY_DEFINITIONS.dead_time.color, stack: '24h' },
          { label: '⏳ Unrecorded Gap', data: k1Summaries.map(s => s.unnoticedHours || 0), backgroundColor: 'rgba(100, 116, 139, 0.45)', borderColor: '#64748b', borderWidth: 1, stack: '24h' },
          { label: '⚠️ Unlogged Gap', data: k1Summaries.map(s => s.unloggedHours || 0), backgroundColor: 'rgba(71, 85, 105, 0.35)', borderColor: '#475569', borderWidth: 1, stack: '24h' },
        ],
      };
      const distOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { color: 'rgba(51, 65, 85, 0.2)' }, ticks: { color: '#94a3b8', font: { size: 12 } } },
          y: { stacked: true, max: 24, title: { display: true, text: '24 Hours Total', color: '#94a3b8' }, grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8', stepSize: 4 } },
        },
        plugins: { legend: { position: 'top', labels: { color: '#cbd5e1', font: { size: 11 } } } },
      };
      return <Bar ref={chartRef} data={distData} options={distOptions} />;
    }

    return null;
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'trajectory':
        return 'Cumulative Growth & Milestone Trajectory';
      case 'radar':
        return 'Training Balance & Pillar Symmetry Radar';
      case 'distribution':
        return '24-Hour Stacked Daily Time Allocation';
      default:
        return 'Fullscreen Performance Analysis';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in">
      {/* Modal Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-border flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-tennis-500/20 text-tennis-400 rounded-xl">
            {chartType === 'trajectory' ? <ZoomIn className="w-5 h-5" /> : chartType === 'radar' ? <Sparkles className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {getChartTitle()}
            </h2>
            <p className="text-xs text-slate-400">
              Interactive fullscreen inspection for {profile1.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chartType === 'trajectory' && (
            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setDisplayMode('points')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  displayMode === 'points'
                    ? 'bg-tennis-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Raw Points
              </button>
              <button
                onClick={() => setDisplayMode('normalized')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  displayMode === 'normalized'
                    ? 'bg-tennis-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                % Normalized
              </button>
            </div>
          )}

          {chartType === 'trajectory' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" /> Reset Zoom
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl"
            title="Close Fullscreen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Fullscreen Canvas */}
      <div className="flex-1 w-full min-h-0 pt-4">
        {renderChart()}
      </div>

      {/* Bottom hint */}
      <div className="pt-2 text-center text-xs text-slate-500">
        💡 Tip: Rotate iPhone to landscape mode for maximum chart resolution.
      </div>
    </div>
  );
};
