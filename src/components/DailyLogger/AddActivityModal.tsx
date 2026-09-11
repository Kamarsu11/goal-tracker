import React, { useState } from 'react';
import { ActivityBlock, ActivityCategory } from '../../types';
import { CATEGORY_DEFINITIONS, calculateDurationHours, formatDuration } from '../../utils/categories';
import { X, Plus, Clock, Tag } from 'lucide-react';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (block: Omit<ActivityBlock, 'id'>) => void;
  initialStartTime?: string;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialStartTime = '16:00',
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('tennis_focus');
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState('17:00');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const duration = calculateDurationHours(startTime, endTime);

  // Quick preset shortcuts
  const PRESET_ACTIVITIES: { title: string; category: ActivityCategory; durationMin: number }[] = [
    { title: '🎾 1:1 Tennis Drills with Dad', category: 'tennis_focus', durationMin: 60 },
    { title: '🎾 Tennis Serve Reps (100 serves)', category: 'tennis_focus', durationMin: 45 },
    { title: '🎾 Tennis Wall Practice', category: 'tennis_focus', durationMin: 30 },
    { title: '🎾 Tennis Match Play / Sets', category: 'tennis_match', durationMin: 90 },
    { title: '🤸 Gymnastics Training', category: 'multisport', durationMin: 150 },
    { title: '🥋 Taekwondo Class', category: 'multisport', durationMin: 130 },
    { title: '🏃 Parkour Training', category: 'multisport', durationMin: 90 },
    { title: '🧘 Shoulder Band Prehab & Mobility', category: 'mobility_prehab', durationMin: 20 },
    { title: '📺 Pro Match Video Analysis', category: 'tennis_iq', durationMin: 30 },
    { title: '📚 Weekly School Homework', category: 'study_homework', durationMin: 60 },
    { title: '🚗 Driving Transit', category: 'transit', durationMin: 30 },
    { title: '🎮 PlayStation / Guilt-Free Chill', category: 'guilt_free_fun', durationMin: 60 },
  ];

  const handleSelectPreset = (preset: (typeof PRESET_ACTIVITIES)[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    // calculate new end time
    const [h, m] = startTime.split(':').map(Number);
    const totalMinutes = h * 60 + m + preset.durationMin;
    const endH = Math.min(23, Math.floor(totalMinutes / 60));
    const endM = totalMinutes % 60;
    setEndTime(`${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      category,
      startTime,
      endTime,
      durationHours: duration,
      completed: true,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-brand-card border border-brand-border w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-tennis-500/20 text-tennis-400 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Add Quick Activity</h3>
              <p className="text-xs text-slate-400">1-Tap Preset or Custom Entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900/60 rounded-xl border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Tap Quick Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-2 block">
            ⚡ Quick 1-Tap Presets:
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-900/50 rounded-xl border border-slate-800/80">
            {PRESET_ACTIVITIES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="text-left px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-lg text-xs transition-all border border-slate-700/50"
              >
                {p.title} <span className="text-[10px] text-slate-400">({p.durationMin}m)</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Activity Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 1:1 Tennis with Dad, Taekwondo, Stretch..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-tennis-500 transition-colors"
              required
            />
          </div>

          {/* Category Selector */}
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
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Start Time
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
                <Clock className="w-3.5 h-3.5 text-slate-400" /> End Time
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
              <span>Calculated Duration:</span>
              <span className="font-bold text-tennis-400 font-mono text-sm">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Notes / Intensity / Drills (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Crosscourt depth, 80% first serve accuracy..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-tennis-500"
            />
          </div>

          {/* Submit */}
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
              className="px-5 py-2.5 rounded-xl bg-tennis-500 hover:bg-tennis-400 text-black text-xs font-bold shadow-lg active:scale-95 transition-all"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
