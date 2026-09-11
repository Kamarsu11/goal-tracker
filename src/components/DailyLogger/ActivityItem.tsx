import React from 'react';
import { ActivityBlock } from '../../types';
import { CATEGORY_DEFINITIONS, formatDuration, adjustTimeString, calculateDurationHours } from '../../utils/categories';
import { CheckCircle2, Circle, Clock, Edit2, Trash2, XCircle, Plus, Minus } from 'lucide-react';

interface ActivityItemProps {
  block: ActivityBlock;
  onToggleComplete: (blockId: string) => void;
  onToggleCancel: (blockId: string) => void;
  onAdjustDuration: (blockId: string, deltaMinutes: number) => void;
  onEdit: (block: ActivityBlock) => void;
  onDelete: (blockId: string) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  block,
  onToggleComplete,
  onToggleCancel,
  onAdjustDuration,
  onEdit,
  onDelete,
}) => {
  const meta = CATEGORY_DEFINITIONS[block.category] || CATEGORY_DEFINITIONS.guilt_free_fun;
  const duration = block.durationHours || calculateDurationHours(block.startTime, block.endTime);

  return (
    <div
      className={`relative rounded-2xl border transition-all p-3.5 shadow-md ${
        block.isCancelled
          ? 'bg-slate-900/40 border-slate-800 opacity-50'
          : block.completed
          ? 'bg-brand-card/95 border-brand-border ring-1 ring-tennis-500/30 hover:border-tennis-500/50'
          : 'bg-slate-900/40 border-slate-800/80 opacity-65 hover:opacity-90'
      }`}
    >
      {/* Category colored indicator bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full transition-opacity ${
          block.completed ? 'opacity-100' : 'opacity-30'
        }`}
        style={{ backgroundColor: meta.color }}
      />

      <div className="pl-2">
        {/* Top row: Checkbox, Title, Category Badge, Duration */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <button
              onClick={() => onToggleComplete(block.id)}
              className="mt-0.5 text-slate-400 hover:text-tennis-400 transition-all focus:outline-none shrink-0"
              title={block.completed ? 'Mark pending (unchecked)' : 'Mark activity completed (checked)'}
            >
              {block.completed ? (
                <CheckCircle2 className="w-5 h-5 text-tennis-400 fill-tennis-400/20" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-tennis-400 transition-colors flex items-center justify-center bg-slate-950/60" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`font-semibold text-sm leading-tight transition-colors ${
                    block.isCancelled
                      ? 'line-through text-slate-500'
                      : block.completed
                      ? 'text-slate-100'
                      : 'text-slate-400 font-normal'
                  }`}
                >
                  {block.title}
                </span>
                {block.isCancelled && (
                  <span className="text-[10px] bg-red-950/80 border border-red-800 text-red-400 px-1.5 py-0.2 rounded">
                    Cancelled
                  </span>
                )}
                {!block.completed && !block.isCancelled && (
                  <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.2 rounded">
                    Pending
                  </span>
                )}
              </div>

              {/* Time & Duration badge */}
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {block.startTime} – {block.endTime}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-semibold text-slate-300">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Category Tag */}
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 transition-opacity ${
              block.completed ? 'opacity-100' : 'opacity-50'
            } ${meta.bgClass} ${meta.textClass} ${meta.borderClass}`}
          >
            {meta.shortLabel}
          </span>
        </div>

        {/* Notes if any */}
        {block.notes && (
          <p className="mt-1 text-xs text-slate-400 pl-7 italic bg-slate-900/40 p-1.5 rounded-lg border border-slate-800/40">
            {block.notes}
          </p>
        )}

        {/* Quick Actions Row: Steppers & Edit */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-brand-border/30 pl-7 text-xs">
          {/* 1-Tap Quick Steppers */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 px-1.5 font-medium">Adjust:</span>
            <button
              onClick={() => onAdjustDuration(block.id, -15)}
              className="flex items-center gap-0.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded font-mono text-[11px] transition-all"
              title="Decrease duration by 15 mins"
            >
              <Minus className="w-3 h-3" /> 15m
            </button>
            <button
              onClick={() => onAdjustDuration(block.id, 15)}
              className="flex items-center gap-0.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-tennis-400 rounded font-mono text-[11px] transition-all font-semibold"
              title="Increase duration by 15 mins"
            >
              <Plus className="w-3 h-3" /> 15m
            </button>
          </div>

          {/* Edit / Cancel / Delete buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleCancel(block.id)}
              className={`p-1.5 rounded-lg border transition-all ${
                block.isCancelled
                  ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={block.isCancelled ? 'Restore activity' : 'Mark cancelled (shifts to rest)'}
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onEdit(block)}
              className="p-1.5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all"
              title="Edit Activity"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(block.id)}
              className="p-1.5 bg-slate-900/60 border border-slate-800 hover:border-red-900 text-slate-400 hover:text-red-400 rounded-lg transition-all"
              title="Delete Activity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
