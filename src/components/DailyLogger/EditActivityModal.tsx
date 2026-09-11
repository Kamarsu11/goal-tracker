import React, { useState, useEffect } from 'react';
import { ActivityBlock, ActivityCategory } from '../../types';
import { CATEGORY_DEFINITIONS, calculateDurationHours, formatDuration } from '../../utils/categories';
import { X, Save, Clock } from 'lucide-react';

interface EditActivityModalProps {
  isOpen: boolean;
  block: ActivityBlock | null;
  onClose: () => void;
  onSave: (updatedBlock: ActivityBlock) => void;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  isOpen,
  block,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('tennis_focus');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(true);

  useEffect(() => {
    if (block) {
      setTitle(block.title);
      setCategory(block.category);
      setStartTime(block.startTime);
      setEndTime(block.endTime);
      setNotes(block.notes || '');
      setCompleted(block.completed);
    }
  }, [block]);

  if (!isOpen || !block) return null;

  const duration = calculateDurationHours(startTime, endTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...block,
      title: title.trim(),
      category,
      startTime,
      endTime,
      durationHours: duration,
      completed,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-card border border-brand-border w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>✏️ Edit Activity</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900/60 rounded-xl border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-tennis-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1 bg-slate-900/40 rounded-xl border border-slate-800">
              {Object.values(CATEGORY_DEFINITIONS)
                .filter(c => c.id !== 'unnoticed_time' && c.id !== 'unlogged_missing')
                .map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-lg text-left text-xs font-medium border transition-all ${
                      category === cat.id
                        ? `${cat.bgClass} ${cat.borderClass} ${cat.textClass} font-bold ring-1 ring-tennis-400`
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.shortLabel}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" /> Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-slate-100 text-center"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" /> End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-slate-100 text-center"
                required
              />
            </div>

            <div className="col-span-2 flex items-center justify-between text-xs text-slate-300 pt-1">
              <span>Duration:</span>
              <span className="font-bold text-tennis-400 font-mono text-sm">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. 1st serve speed, rally tolerance..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-tennis-500"
            />
          </div>

          {/* Completed Toggle */}
          <div className="flex items-center gap-2 p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl">
            <input
              type="checkbox"
              id="editCompleted"
              checked={completed}
              onChange={e => setCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-tennis-500 bg-slate-800 border-slate-700 focus:ring-tennis-500"
            />
            <label htmlFor="editCompleted" className="text-xs text-slate-200 font-medium">
              Mark as completed / executed
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-tennis-500 hover:bg-tennis-400 text-black text-xs font-bold shadow-lg active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
