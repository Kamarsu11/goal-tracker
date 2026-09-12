import React from 'react';
import { ActivityBlock } from '../../types';
import { CATEGORY_DEFINITIONS, formatDuration, calculateDurationHours } from '../../utils/categories';
import { CheckCircle2, Clock, Edit2, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

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

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={e => onDragStart && onDragStart(e, index)}
      onDragOver={e => onDragOver && onDragOver(e, index)}
      onDrop={e => onDrop && onDrop(e, index)}
      className={`relative rounded-2xl border transition-all p-3 shadow-sm ${
        block.isCancelled
          ? 'bg-slate-900/40 border-slate-800 opacity-50'
          : block.completed
          ? 'bg-brand-card/95 border-brand-border ring-1 ring-tennis-500/20 hover:border-tennis-500/40'
          : 'bg-slate-900/40 border-slate-800/80 opacity-70 hover:opacity-90'
      }`}
    >
      {/* Category colored indicator bar */}
      <div
        className={`absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-r-full transition-opacity ${
          block.completed ? 'opacity-100' : 'opacity-40'
        }`}
        style={{ backgroundColor: meta.color }}
      />

      <div className="pl-1 sm:pl-2">
        {/* Main row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {/* Drag Handle */}
            <div
              className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 transition-colors p-0.5"
              title="Hold and drag to reorder activity"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Completion Checkbox */}
            <button
              onClick={() => onToggleComplete(block.id)}
              className="text-slate-400 hover:text-tennis-400 transition-all focus:outline-none shrink-0"
              title={block.completed ? 'Mark pending' : 'Mark completed'}
            >
              {block.completed ? (
                <CheckCircle2 className="w-5 h-5 text-tennis-400 fill-tennis-400/20" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-600 hover:border-tennis-400 transition-colors flex items-center justify-center bg-slate-950/60" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold text-sm truncate transition-colors ${
                    block.isCancelled
                      ? 'line-through text-slate-500'
                      : block.completed
                      ? 'text-slate-100'
                      : 'text-slate-400 font-normal'
                  }`}
                >
                  {block.title}
                </span>
                {!block.completed && !block.isCancelled && (
                  <span className="text-[10px] bg-slate-800/80 border border-slate-700/80 text-slate-400 px-1.5 py-0.2 rounded font-medium shrink-0">
                    Pending
                  </span>
                )}
              </div>

              {/* Time & Duration */}
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-slate-300 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {block.startTime} – {block.endTime}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-semibold text-slate-300 text-[11px]">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Right section: Category Tag & Edit / Delete */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 transition-opacity ${
                block.completed ? 'opacity-100' : 'opacity-50'
              } ${meta.bgClass} ${meta.textClass} ${meta.borderClass}`}
            >
              {meta.shortLabel}
            </span>

            {/* Reorder Arrows */}
            <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-800/80 p-0.5">
              <button
                disabled={index === 0}
                onClick={() => onMoveUp && onMoveUp(index)}
                className={`p-1 rounded transition-colors ${
                  index === 0 ? 'text-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Move Up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                disabled={index === totalCount - 1}
                onClick={() => onMoveDown && onMoveDown(index)}
                className={`p-1 rounded transition-colors ${
                  index === totalCount - 1 ? 'text-slate-700' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Move Down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => onEdit(block)}
              className="p-1.5 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all"
              title="Edit Activity"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(block.id)}
              className="p-1.5 bg-slate-900/60 border border-slate-800/80 hover:border-red-900 text-slate-400 hover:text-red-400 rounded-lg transition-all"
              title="Delete Activity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notes if any */}
        {block.notes && (
          <p className="mt-2 text-xs text-slate-400 italic bg-slate-900/40 p-1.5 rounded-lg border border-slate-800/40 ml-7">
            {block.notes}
          </p>
        )}
      </div>
    </div>
  );
};
