import React from 'react';
import { ActivityBlock } from '../../types';
import { CATEGORY_DEFINITIONS, formatDuration, calculateDurationHours } from '../../utils/categories';
import { CheckCircle2, Clock, Edit2, Trash2, GripVertical, ChevronUp, ChevronDown, Zap } from 'lucide-react';

interface ActivityItemProps {
  block: ActivityBlock;
  index: number;
  totalCount: number;
  onToggleComplete: (blockId: string) => void;
  onToggleCancel?: (blockId: string) => void;
  onAdjustDuration?: (blockId: string, deltaMinutes: number) => void;
  onEdit: (block: ActivityBlock) => void;
  onDelete: (blockId: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  block,
  index,
  totalCount,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const meta = CATEGORY_DEFINITIONS[block.category] || CATEGORY_DEFINITIONS.guilt_free_fun;
  const duration = block.durationHours || calculateDurationHours(block.startTime, block.endTime);
  const earnedScore = meta.effectiveWeight > 0 ? (duration * meta.effectiveWeight).toFixed(2) : null;

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={e => onDragStart && onDragStart(e, index)}
      onDragOver={e => onDragOver && onDragOver(e, index)}
      onDrop={e => onDrop && onDrop(e, index)}
      className={`relative rounded-2xl border transition-all p-3 sm:p-3.5 shadow-sm space-y-2.5 ${
        block.isCancelled
          ? 'bg-slate-900/40 border-slate-800 opacity-50'
          : block.completed
          ? 'bg-brand-card/95 border-brand-border ring-1 ring-tennis-500/20 hover:border-tennis-500/40'
          : 'bg-slate-900/40 border-slate-800/80 opacity-75 hover:opacity-95'
      }`}
    >
      {/* Category colored indicator bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full transition-opacity ${
          block.completed ? 'opacity-100' : 'opacity-40'
        }`}
        style={{ backgroundColor: meta.color }}
      />

      <div className="pl-1.5 sm:pl-2.5 space-y-2">
        {/* Row 1: Checkbox, Title (full width without squeezing), Category Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Drag Handle */}
            <div
              className="mt-0.5 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 transition-colors p-0.5 shrink-0"
              title="Hold and drag to reorder activity"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Completion Checkbox */}
            <button
              onClick={() => onToggleComplete(block.id)}
              className="mt-0.5 text-slate-400 hover:text-tennis-400 transition-all focus:outline-none shrink-0"
              title={block.completed ? 'Mark pending' : 'Mark completed'}
            >
              {block.completed ? (
                <CheckCircle2 className="w-5 h-5 text-tennis-400 fill-tennis-400/20" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-tennis-400 transition-colors flex items-center justify-center bg-slate-950/60" />
              )}
            </button>

            {/* Activity Title (Can wrap cleanly in multiple lines on narrow mobile screens) */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`font-semibold text-sm leading-snug break-words transition-colors ${
                    block.isCancelled
                      ? 'line-through text-slate-500'
                      : block.completed
                      ? 'text-slate-100'
                      : 'text-slate-300 font-medium'
                  }`}
                >
                  {block.title}
                </span>

                {block.isCancelled && (
                  <span className="text-[10px] bg-red-950/80 border border-red-800 text-red-400 px-1.5 py-0.2 rounded font-medium shrink-0">
                    Cancelled
                  </span>
                )}
                {!block.completed && !block.isCancelled && (
                  <span className="text-[10px] bg-slate-800/90 border border-slate-700 text-slate-400 px-1.5 py-0.2 rounded font-medium shrink-0">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Category Tag (Top Right) */}
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 transition-opacity whitespace-nowrap self-start ${
              block.completed ? 'opacity-100' : 'opacity-60'
            } ${meta.bgClass} ${meta.textClass} ${meta.borderClass}`}
          >
            {meta.shortLabel}
          </span>
        </div>

        {/* Row 2: Timing, Duration, Athletic Points (Indented directly under title) */}
        <div className="flex items-center gap-2 pl-7 text-xs text-slate-400 flex-wrap">
          <div className="flex items-center gap-1 font-mono text-slate-300 text-[11px] bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800/60">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{block.startTime} – {block.endTime}</span>
          </div>

          <span className="text-slate-600 font-bold">•</span>

          <span className="font-semibold text-slate-200 text-[11px]">
            {formatDuration(duration)}
          </span>

          {earnedScore && block.completed && (
            <>
              <span className="text-slate-600 font-bold">•</span>
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-lime-400 bg-lime-950/40 border border-lime-800/50 px-1.5 py-0.2 rounded">
                <Zap className="w-2.5 h-2.5" /> +{earnedScore} pts
              </span>
            </>
          )}
        </div>

        {/* Row 3: Notes if any */}
        {block.notes && (
          <p className="text-xs text-slate-400 italic bg-slate-900/40 p-2 rounded-lg border border-slate-800/40 ml-7 break-words">
            {block.notes}
          </p>
        )}

        {/* Row 4: Controls Toolbar (Move Up / Down, Edit, Delete) */}
        <div className="flex items-center justify-between pt-2 border-t border-brand-border/30 pl-7 text-xs">
          {/* Reorder Arrows */}
          <div className="flex items-center bg-slate-900/90 rounded-lg border border-slate-800 p-0.5">
            <button
              disabled={index === 0}
              onClick={() => onMoveUp && onMoveUp(index)}
              className={`p-1 rounded transition-colors ${
                index === 0 ? 'text-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              disabled={index === totalCount - 1}
              onClick={() => onMoveDown && onMoveDown(index)}
              className={`p-1 rounded transition-colors ${
                index === totalCount - 1 ? 'text-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons: Edit & Delete */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(block)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 rounded-lg text-xs font-medium transition-all"
              title="Edit Activity"
            >
              <Edit2 className="w-3 h-3 text-tennis-400" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(block.id)}
              className="p-1 bg-slate-900/80 hover:bg-red-950/60 border border-slate-800 hover:border-red-900 text-slate-400 hover:text-red-400 rounded-lg transition-all"
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
