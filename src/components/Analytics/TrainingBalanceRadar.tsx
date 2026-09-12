import React from 'react';
import './chartConfig';
import { Radar } from 'react-chartjs-2';
import { DailySummary, ChildProfile } from '../../types';
import { AGE_BENCHMARKS } from '../../utils/defaultSchedules';
import { ShieldAlert, Sparkles, Maximize2 } from 'lucide-react';

interface TrainingBalanceRadarProps {
  summaries: DailySummary[];
  profile: ChildProfile;
  onOpenFullscreen?: () => void;
}

export const TrainingBalanceRadar: React.FC<TrainingBalanceRadarProps> = ({ summaries, profile, onOpenFullscreen }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  // Calculate elapsed days up to and including today (excludes unreached future days of the week)
  const elapsedSummaries = summaries.filter(s => s.date <= todayStr);
  const effectiveSummaries = elapsedSummaries.length > 0 ? elapsedSummaries : summaries;
  const confirmedSummaries = effectiveSummaries.filter(s => s.status === 'confirmed' || s.status === 'sick');
  const totalDays = effectiveSummaries.length;
  const periodFactor = totalDays / 7;

  const benchmark = AGE_BENCHMARKS[profile.age] || AGE_BENCHMARKS[11];

  // Actual logged totals in selected period
  const actTennis = confirmedSummaries.reduce((a, b) => a + b.tennisHours, 0);
  const actMulti = confirmedSummaries.reduce((a, b) => a + b.multisportHours, 0);
  const actSC = confirmedSummaries.reduce((a, b) => a + b.scFootworkHours, 0);
  const actPrehab = confirmedSummaries.reduce((a, b) => a + b.mobilityHours, 0);
  const actIQ = confirmedSummaries.reduce((a, b) => a + b.tennisIqHours, 0);
  const actRest = confirmedSummaries.reduce((a, b) => a + b.intentionalRestHours, 0);
  const actSleep = confirmedSummaries.reduce((a, b) => a + b.sleepHours, 0);

  // Targets scaled precisely to the selected period (1 day for Today/Yesterday, 7 days for This Week, etc.)
  const targetTennis = (benchmark.weeklyTargets.highIntensityTennisHours + benchmark.weeklyTargets.practiceMatchHours + benchmark.weeklyTargets.squadPracticeHours) * periodFactor;
  const targetMulti = benchmark.weeklyTargets.multisportHours * periodFactor;
  const targetSC = benchmark.weeklyTargets.scFootworkHours * periodFactor;
  const targetPrehab = benchmark.weeklyTargets.prehabHours * periodFactor;
  const targetIQ = benchmark.weeklyTargets.tennisIqHours * periodFactor;
  const targetRest = benchmark.weeklyTargets.intentionalRestHours * periodFactor;
  const targetSleep = (benchmark.weeklyTargets.sleepHoursPerNight * 7) * periodFactor;

  // Percentage fulfillment capped at 150% for visualization symmetry
  const pctTennis = targetTennis > 0 ? Math.min(150, Math.round((actTennis / targetTennis) * 100)) : 100;
  const pctMulti = targetMulti > 0 ? Math.min(150, Math.round((actMulti / targetMulti) * 100)) : 100;
  const pctSC = targetSC > 0 ? Math.min(150, Math.round((actSC / targetSC) * 100)) : 100;
  const pctPrehab = targetPrehab > 0 ? Math.min(150, Math.round((actPrehab / targetPrehab) * 100)) : 100;
  const pctIQ = targetIQ > 0 ? Math.min(150, Math.round((actIQ / targetIQ) * 100)) : 100;
  const pctRest = targetRest > 0 ? Math.min(150, Math.round((actRest / targetRest) * 100)) : 100;
  const pctSleep = targetSleep > 0 ? Math.min(150, Math.round((actSleep / targetSleep) * 100)) : 100;

  const periodLabel = totalDays === 1 ? '1-Day' : `${totalDays}-Day`;

  const labels = [
    '🎾 Tennis Volume',
    '🥋 Multisport Power',
    '⚡ S&C & Footwork',
    '🧘 Pre-hab & Mobility',
    '🧠 Tennis IQ',
    '🛌 Intentional Rest',
    '😴 Sleep Recovery',
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: `⭐ Ideal Pro Target Shape (100% Symmetrical)`,
        data: [100, 100, 100, 100, 100, 100, 100],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 3,
        pointBackgroundColor: '#38bdf8',
      },
      {
        label: `🎾 ${profile.name} (Actual Distribution)`,
        data: [pctTennis, pctMulti, pctSC, pctPrehab, pctIQ, pctRest, pctSleep],
        borderColor: profile.id === 'kid1' ? '#84cc16' : '#06b6d4',
        backgroundColor: profile.id === 'kid1' ? 'rgba(132, 204, 22, 0.25)' : 'rgba(6, 182, 212, 0.25)',
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: profile.id === 'kid1' ? '#84cc16' : '#06b6d4',
      },
    ],
  };

  const chartOptions: any = {
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
        ticks: {
          stepSize: 25,
          color: '#94a3b8',
          backdropColor: 'transparent',
          font: { size: 9 },
        },
        pointLabels: {
          color: '#e2e8f0',
          font: { size: 10, weight: 'bold' },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { size: 11, weight: '600' },
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
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

  const isPrehabDeficit = pctPrehab < 40 && actTennis > 5;

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Training Balance & Pillar Distribution Radar
            </h3>
            <p className="text-[11px] text-slate-400">
              Detects structural balance across athletic training, pre-hab, rest & sleep recovery (Ideal: Symmetrical Shape)
            </p>
          </div>
        </div>

        {isPrehabDeficit && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/80 border border-red-800 text-red-300 rounded-lg text-xs font-semibold animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Overuse Risk: Low Prehab vs High Tennis</span>
          </div>
        )}

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

      {/* Radar Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-1">
        <Radar data={chartData} options={chartOptions} />
      </div>

      {/* Pillar Breakdown Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-2 border-t border-brand-border/40 text-xs text-center">
        <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Tennis ({periodLabel})</div>
          <div className="font-bold text-lime-400">{actTennis.toFixed(1)}h / {targetTennis.toFixed(1)}h</div>
          <div className={`text-[10px] font-semibold ${pctTennis >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pctTennis}%</div>
        </div>

        <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Multisport ({periodLabel})</div>
          <div className="font-bold text-indigo-400">{actMulti.toFixed(1)}h / {targetMulti.toFixed(1)}h</div>
          <div className={`text-[10px] font-semibold ${pctMulti >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pctMulti}%</div>
        </div>

        <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">S&C Footwork</div>
          <div className="font-bold text-amber-300">{actSC.toFixed(1)}h / {targetSC.toFixed(1)}h</div>
          <div className={`text-[10px] font-semibold ${pctSC >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pctSC}%</div>
        </div>

        <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Pre-hab</div>
          <div className="font-bold text-pink-400">{actPrehab.toFixed(1)}h / {targetPrehab.toFixed(1)}h</div>
          <div className={`text-[10px] font-semibold ${pctPrehab >= 80 ? 'text-emerald-400' : 'text-red-400'}`}>{pctPrehab}%</div>
        </div>

        <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Tennis IQ</div>
          <div className="font-bold text-purple-400">{actIQ.toFixed(1)}h / {targetIQ.toFixed(1)}h</div>
          <div className={`text-[10px] font-semibold ${pctIQ >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pctIQ}%</div>
        </div>

        <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">Rest</div>
          <div className="font-bold text-cyan-400">{actRest.toFixed(1)}h / {targetRest.toFixed(1)}h</div>
          <div className={`text-[10px] font-semibold ${pctRest >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pctRest}%</div>
        </div>

        <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="text-[10px] text-slate-400">Sleep</div>
          <div className="font-bold text-blue-400">{actSleep.toFixed(1)}h / {targetSleep.toFixed(1)}h</div>
          <div className={`text-[10px] font-semibold ${pctSleep >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pctSleep}%</div>
        </div>
      </div>
    </div>
  );
};
