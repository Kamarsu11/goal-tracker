import React from 'react';
import { ActivityBlock, ActivityCategory, DayStatus } from '../../types';
import { CATEGORY_DEFINITIONS, computeDayCoverage, formatDuration } from '../../utils/categories';

interface Day24hBarProps {
  blocks: ActivityBlock[];
  status: DayStatus;
}

export const Day24hBar: React.FC<Day24hBarProps> = ({ blocks, status }) => {
  const isConfirmed = status === 'confirmed' || status === 'sick';
  const coverage = computeDayCoverage(blocks, isConfirmed);

  const categoriesOrder: ActivityCategory[] = [
    'tennis_focus',
    'tennis_squad',
    'tennis_match',
    'tennis_companion',
    'tennis_iq',
    'multisport',
    'mobility_prehab',
    'school',
    'study_homework',
    'transit',
    'sleep',
    'guilt_free_fun',
    'unnoticed_time',
    'unlogged_missing',
  ];

  return (
    <div className="bg-brand-card/90 border border-brand-border/60 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-medium">
        <span className="flex items-center gap-1.5 font-semibold text-slate-200">
          <span>🕒 24-Hour Timeline</span>
          <span className="text-[11px] text-slate-400 font-normal">
            ({coverage.totalLoggedHours}h logged)
          </span>
        </span>
        <div className="flex items-center gap-2">
          {coverage.categoryTotals.unnoticed_time > 0 && (
            <span className="text-red-400 font-bold bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded-full text-[10px]">
              🔴 {formatDuration(coverage.categoryTotals.unnoticed_time)} Unnoticed
            </span>
          )}
          {coverage.categoryTotals.unlogged_missing > 0 && (
            <span className="text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px]">
              ⚠️ {formatDuration(coverage.categoryTotals.unlogged_missing)} Unlogged
            </span>
          )}
        </div>
      </div>

      {/* The 24-hour visual progress bar */}
      <div className="w-full h-7 bg-slate-900 rounded-xl overflow-hidden flex border border-slate-700/60 shadow-inner">
        {categoriesOrder.map(cat => {
          const hours = coverage.categoryTotals[cat] || 0;
          if (hours <= 0) return null;
          const percentage = (hours / 24) * 100;
          const meta = CATEGORY_DEFINITIONS[cat];

          return (
            <div
              key={cat}
              style={{
                width: `${percentage}%`,
                backgroundColor: meta.color,
              }}
              className={`h-full relative group transition-all duration-300 ${
                cat === 'unlogged_missing' ? 'opacity-40 bg-stripes' : ''
              } ${cat === 'unnoticed_time' ? 'animate-pulse' : ''}`}
              title={`${meta.shortLabel}: ${formatDuration(hours)} (${percentage.toFixed(0)}%)`}
            >
              {percentage > 7 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black/90 drop-shadow-sm select-none truncate px-0.5">
                  {formatDuration(hours)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend Pills */}
      <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-brand-border/40 text-[11px]">
        {categoriesOrder.map(cat => {
          const hours = coverage.categoryTotals[cat] || 0;
          if (hours <= 0) return null;
          const meta = CATEGORY_DEFINITIONS[cat];

          return (
            <div
              key={cat}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${meta.bgClass} ${meta.borderClass} ${meta.textClass}`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: meta.color }}
              />
              <span className="font-medium">{meta.shortLabel}:</span>
              <span className="font-bold">{formatDuration(hours)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
