import React from 'react';
import { DailySummary, ChildProfile } from '../../types';
import { Trophy, Dumbbell, Moon, AlertCircle, TrendingUp, Clock } from 'lucide-react';

interface StatsSummaryCardsProps {
  summaries: DailySummary[];
  profile: ChildProfile;
}

export const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({ summaries, profile }) => {
  const totalDays = summaries.length || 1;

  const totalTennisHours = summaries.reduce((acc, s) => acc + s.tennisHours, 0);
  const totalIdealTennisHours = summaries.reduce((acc, s) => acc + s.idealTennisTarget, 0);
  const totalMultisportHours = summaries.reduce((acc, s) => acc + s.multisportHours, 0);
  const totalMobilityHours = summaries.reduce((acc, s) => acc + s.mobilityHours, 0);
  const totalSleepHours = summaries.reduce((acc, s) => acc + s.sleepHours, 0);
  const totalUnnoticedHours = summaries.reduce((acc, s) => acc + s.unnoticedHours, 0);
  const totalUnloggedHours = summaries.reduce((acc, s) => acc + s.unloggedHours, 0);
  const totalEffectiveScore = summaries.reduce((acc, s) => acc + s.effectiveTennisScore, 0);
  const totalIdealScore = summaries.reduce((acc, s) => acc + s.idealScoreTarget, 0);

  const avgSleepPerNight = (totalSleepHours / totalDays).toFixed(2);
  const avgUnnoticedPerDay = (totalUnnoticedHours / totalDays).toFixed(2);
  const tennisMultiRatio = totalMultisportHours > 0 ? (totalTennisHours / totalMultisportHours).toFixed(2) : 'N/A';
  
  const tennisDiff = totalTennisHours - totalIdealTennisHours;
  const tennisDiffText =
    tennisDiff > 0
      ? `+${tennisDiff.toFixed(2)}h above target`
      : tennisDiff < 0
      ? `${Math.abs(tennisDiff).toFixed(2)}h below target`
      : 'On target';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* 1. Tennis Total & Ideal Target */}
      <div className="bg-brand-card/90 border border-brand-border rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Tennis Volume
          </span>
          <div className="p-1.5 bg-lime-500/20 text-lime-400 rounded-lg">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-100">{totalTennisHours.toFixed(2)}h</span>
          <span className="text-xs text-slate-400">/ {totalIdealTennisHours.toFixed(2)}h Target</span>
        </div>
        <div className="mt-1 text-[11px] text-lime-400 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-tennis-400" />
          <span>{tennisDiffText}</span>
        </div>
      </div>

      {/* 2. Multisport & Ratio */}
      <div className="bg-brand-card/90 border border-brand-border rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Multisport
          </span>
          <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Dumbbell className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-100">{totalMultisportHours.toFixed(2)}h</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Ratio: <span className="text-indigo-300 font-semibold">{tennisMultiRatio}x</span> (Tennis:Multi)
        </div>
      </div>

      {/* 3. Sleep & Recovery */}
      <div className="bg-brand-card/90 border border-brand-border rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Sleep Avg
          </span>
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
            <Moon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-100">{avgSleepPerNight}h</span>
          <span className="text-xs text-slate-400">/ night</span>
        </div>
        <div className="mt-1 text-[11px] text-blue-300 font-medium">
          {parseFloat(avgSleepPerNight) >= 9.2 ? '✅ Optimal Recovery' : '⚠️ Need >9.5h'}
        </div>
      </div>

      {/* 4. Unnoticed Time / Silent Killer */}
      <div className="bg-brand-card/90 border border-brand-border rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Unnoticed Dead Time
          </span>
          <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-red-400">{totalUnnoticedHours.toFixed(2)}h</span>
          <span className="text-xs text-slate-400">({avgUnnoticedPerDay}h/day)</span>
        </div>
        <div className="mt-1 text-[11px] flex items-center gap-1">
          {totalUnloggedHours > 0 ? (
            <span className="text-amber-400 text-[10px]">
              ⚠️ {totalUnloggedHours.toFixed(2)}h unrecorded
            </span>
          ) : (
            <span className="text-slate-400">
              Target: &lt;1.5h/day
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
