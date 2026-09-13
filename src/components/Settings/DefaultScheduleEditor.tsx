import React, { useState, useEffect } from 'react';
import { TermSchedule, DayOfWeek, ChildProfile, ActivityBlock } from '../../types';
import { CATEGORY_DEFINITIONS, formatDuration, calculateDurationHours } from '../../utils/categories';
import { Clock, Plus, Trash2, Save, Calendar, Check, Copy, Edit3, GripVertical, ChevronUp, ChevronDown, ArrowDownUp } from 'lucide-react';

interface DefaultScheduleEditorProps {
  term: TermSchedule;
  profiles: ChildProfile[];
  onSaveTerm: (updatedTerm: TermSchedule) => Promise<void>;
}

const DEFAULT_DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday (Gymnastics)',
  tuesday: 'Tuesday (Tennis + TKD)',
  wednesday: 'Wednesday (Gymnastics)',
  thursday: 'Thursday (Tennis + Dad 1:1)',
  friday: 'Friday (Tennis + Parkour)',
  saturday: 'Saturday (Taekwondo + Match)',
  sunday: 'Sunday (Parkour + Serves)',
};

const DAYS_ORDER: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const DefaultScheduleEditor: React.FC<DefaultScheduleEditorProps> = ({
  term,
  profiles,
  onSaveTerm,
}) => {
  const [selectedKid, setSelectedKid] = useState<'kid1' | 'kid2'>('kid1');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [currentTerm, setCurrentTerm] = useState<TermSchedule>(term);
  const [savedNotice, setSavedNotice] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTerm(term);
  }, [term]);

  const otherKid: 'kid1' | 'kid2' = selectedKid === 'kid1' ? 'kid2' : 'kid1';
  const otherKidProfile = profiles.find(p => p.id === otherKid) || { name: otherKid === 'kid1' ? 'Kid 1' : 'Kid 2' };
  const currentKidProfile = profiles.find(p => p.id === selectedKid) || { name: selectedKid === 'kid1' ? 'Kid 1' : 'Kid 2' };

  const dayLabels = {
    ...DEFAULT_DAY_LABELS,
    ...(currentTerm.dayLabels || {}),
  };

  const currentBlocks = currentTerm.weeklyDefaults?.[selectedKid]?.[selectedDay] || [];

  const handleUpdateDayLabel = (newLabel: string) => {
    const updatedLabels = {
      ...dayLabels,
      [selectedDay]: newLabel,
    };
    setCurrentTerm({
      ...currentTerm,
      dayLabels: updatedLabels,
    });
  };

  const handleUpdateBlock = (index: number, updated: ActivityBlock) => {
    const newBlocks = [...currentBlocks];
    newBlocks[index] = updated;
    const newWeekly = {
      ...currentTerm.weeklyDefaults,
      [selectedKid]: {
        ...currentTerm.weeklyDefaults[selectedKid],
        [selectedDay]: newBlocks,
      },
    };
    setCurrentTerm({ ...currentTerm, weeklyDefaults: newWeekly });
  };

  const handleDeleteBlock = (index: number) => {
    const newBlocks = currentBlocks.filter((_, i) => i !== index);
    const newWeekly = {
      ...currentTerm.weeklyDefaults,
      [selectedKid]: {
        ...currentTerm.weeklyDefaults[selectedKid],
        [selectedDay]: newBlocks,
      },
    };
    setCurrentTerm({ ...currentTerm, weeklyDefaults: newWeekly });
  };

  const handleAddDefaultBlock = () => {
    const newBlock: ActivityBlock = {
      id: `def_${Date.now()}`,
      category: 'tennis_focus',
      title: 'New Activity',
      startTime: '16:00',
      endTime: '17:00',
      durationHours: 1.0,
      completed: false,
    };
    const newBlocks = [...currentBlocks, newBlock];
    const newWeekly = {
      ...currentTerm.weeklyDefaults,
      [selectedKid]: {
        ...currentTerm.weeklyDefaults[selectedKid],
        [selectedDay]: newBlocks,
      },
    };
    setCurrentTerm({ ...currentTerm, weeklyDefaults: newWeekly });
  };

  // Move block Up / Down
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentBlocks.length) return;
    const newBlocks = [...currentBlocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    const newWeekly = {
      ...currentTerm.weeklyDefaults,
      [selectedKid]: {
        ...currentTerm.weeklyDefaults[selectedKid],
        [selectedDay]: newBlocks,
      },
    };
    setCurrentTerm({ ...currentTerm, weeklyDefaults: newWeekly });
  };

  // Drag & drop handlers
  const handleDragStart = (_e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, _index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    const newBlocks = [...currentBlocks];
    const [moved] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(dropIndex, 0, moved);
    setDraggedIndex(null);
    const newWeekly = {
      ...currentTerm.weeklyDefaults,
      [selectedKid]: {
        ...currentTerm.weeklyDefaults[selectedKid],
        [selectedDay]: newBlocks,
      },
    };
    setCurrentTerm({ ...currentTerm, weeklyDefaults: newWeekly });
  };

  // Auto-sort default blocks chronologically
  const handleAutoSort = () => {
    const sorted = [...currentBlocks].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const newWeekly = {
      ...currentTerm.weeklyDefaults,
      [selectedKid]: {
        ...currentTerm.weeklyDefaults[selectedKid],
        [selectedDay]: sorted,
      },
    };
    setCurrentTerm({ ...currentTerm, weeklyDefaults: newWeekly });
  };

  // Copy single day from current kid to other kid
  const handleCopySingleDayToOtherKid = async () => {
    const sourceBlocks = currentTerm.weeklyDefaults[selectedKid]?.[selectedDay] || [];
    const deepCopied = sourceBlocks.map((b, i) => ({
      ...b,
      id: `def_${otherKid}_${selectedDay}_${i}_${Date.now()}`,
    }));

    const newWeekly = {
      ...currentTerm.weeklyDefaults,
      [otherKid]: {
        ...(currentTerm.weeklyDefaults[otherKid] || {}),
        [selectedDay]: deepCopied,
      },
    };

    const updatedTerm = { ...currentTerm, weeklyDefaults: newWeekly };
    setCurrentTerm(updatedTerm);
    await onSaveTerm(updatedTerm);
    setActionNotice(`Copied ${dayLabels[selectedDay]} to ${otherKidProfile.name} & Saved!`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Copy all 7 days from current kid to other kid
  const handleCopyAllDaysToOtherKid = async () => {
    if (
      !window.confirm(
        `Are you sure you want to copy all 7 days of default schedules from ${currentKidProfile.name} to ${otherKidProfile.name}?`
      )
    ) {
      return;
    }

    const newOtherKidSchedule: Record<DayOfWeek, ActivityBlock[]> = {} as any;
    for (const day of DAYS_ORDER) {
      const sourceBlocks = currentTerm.weeklyDefaults[selectedKid]?.[day] || [];
      newOtherKidSchedule[day] = sourceBlocks.map((b, i) => ({
        ...b,
        id: `def_${otherKid}_${day}_${i}_${Date.now()}`,
      }));
    }

    const newWeekly = {
      ...currentTerm.weeklyDefaults,
      [otherKid]: newOtherKidSchedule,
    };

    const updatedTerm = { ...currentTerm, weeklyDefaults: newWeekly };
    setCurrentTerm(updatedTerm);
    await onSaveTerm(updatedTerm);
    setActionNotice(`Copied all 7 days to ${otherKidProfile.name} & Saved!`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSaveAll = async () => {
    await onSaveTerm(currentTerm);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-tennis-400" />
            <span>Weekly Recurring Default Schedules</span>
          </h3>
          <p className="text-xs text-slate-400">
            Customize the standard templates and day names that auto-load for each day of the week
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-4 py-2 bg-tennis-500 hover:bg-tennis-400 text-black text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all"
        >
          {savedNotice ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'Saved!' : 'Save Template'}</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Child Selector & Sibling Copy Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-brand-border/40">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Editing for:</span>
          <div className="flex gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedKid('kid1')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedKid === 'kid1'
                  ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👦 {profiles.find(p => p.id === 'kid1')?.name || 'Elder Boy (Kid 1)'}
            </button>
            <button
              onClick={() => setSelectedKid('kid2')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedKid === 'kid2'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              👦 {profiles.find(p => p.id === 'kid2')?.name || 'Younger Boy (Kid 2)'}
            </button>
          </div>
        </div>

        {/* Copy settings to other kid buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopySingleDayToOtherKid}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 rounded-xl text-xs font-medium active:scale-95 transition-all"
            title={`Copy ${dayLabels[selectedDay]} schedule to ${otherKidProfile.name}`}
          >
            <Copy className="w-3.5 h-3.5 text-indigo-400" />
            <span>Copy this Day to {otherKidProfile.name.split(' ')[0]}</span>
          </button>
          <button
            onClick={handleCopyAllDaysToOtherKid}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-600 text-indigo-200 rounded-xl text-xs font-bold active:scale-95 transition-all"
            title={`Copy all 7 days to ${otherKidProfile.name}`}
          >
            <Copy className="w-3.5 h-3.5 text-indigo-300" />
            <span>Copy All 7 Days</span>
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex flex-wrap gap-1.5">
        {DAYS_ORDER.map(dayKey => (
          <button
            key={dayKey}
            onClick={() => setSelectedDay(dayKey)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedDay === dayKey
                ? 'bg-tennis-500 text-black font-bold border-tennis-500 shadow-md'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {dayLabels[dayKey]}
          </button>
        ))}
      </div>

      {/* Editable Day Label input */}
      <div className="flex items-center gap-2 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
        <Edit3 className="w-4 h-4 text-tennis-400 shrink-0" />
        <span className="text-xs text-slate-400 font-semibold shrink-0">Edit Day Name:</span>
        <input
          type="text"
          value={dayLabels[selectedDay]}
          onChange={e => handleUpdateDayLabel(e.target.value)}
          placeholder="e.g. Monday (Gymnastics + Tennis)"
          className="flex-1 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-100 font-bold focus:outline-none focus:border-tennis-500"
        />
      </div>

      {/* Blocks List */}
      <div className="space-y-2.5 pt-2 border-t border-brand-border/40">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium flex-wrap gap-2">
          <span>
            Default Schedule for <strong className="text-slate-200">{currentKidProfile.name}</strong> on <strong className="text-tennis-400">{dayLabels[selectedDay]}</strong>:
          </span>
          <div className="flex items-center gap-2">
            {currentBlocks.length > 1 && (
              <button
                onClick={handleAutoSort}
                className="flex items-center gap-1 text-slate-300 hover:text-tennis-400 font-semibold"
                title="Sort items chronologically"
              >
                <ArrowDownUp className="w-3.5 h-3.5 text-tennis-400" /> Auto-Sort
              </button>
            )}
            <button
              onClick={handleAddDefaultBlock}
              className="flex items-center gap-1 text-tennis-400 hover:underline font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Block
            </button>
          </div>
        </div>

        {currentBlocks.map((b, idx) => {
          const meta = CATEGORY_DEFINITIONS[b.category] || CATEGORY_DEFINITIONS.guilt_free_fun;
          return (
            <div
              key={b.id || idx}
              draggable
              onDragStart={e => handleDragStart(e, idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={e => handleDrop(e, idx)}
              className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2 shadow-md transition-all hover:border-slate-700"
            >
              {/* Row 1: Grip + Color Bar + Title + Delete */}
              <div className="flex items-center gap-2">
                <div
                  className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-0.5"
                  title="Hold and drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                <div
                  className="w-2 h-6 rounded-full shrink-0"
                  style={{ backgroundColor: meta.color }}
                />

                <input
                  type="text"
                  value={b.title}
                  onChange={e => handleUpdateBlock(idx, { ...b, title: e.target.value })}
                  placeholder="Activity title..."
                  className="flex-1 min-w-0 bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-lg text-slate-100 font-semibold focus:outline-none focus:border-tennis-500"
                />

                {/* Move Up/Down controls */}
                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveBlock(idx, 'up')}
                    className={`p-1 rounded ${idx === 0 ? 'text-slate-600' : 'text-slate-400 hover:text-slate-200'}`}
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === currentBlocks.length - 1}
                    onClick={() => handleMoveBlock(idx, 'down')}
                    className={`p-1 rounded ${idx === currentBlocks.length - 1 ? 'text-slate-600' : 'text-slate-400 hover:text-slate-200'}`}
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteBlock(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/40 shrink-0"
                  title="Delete Block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Row 2: Category Dropdown + Times + Duration Badge (Responsive Wrap) */}
              <div className="flex items-center justify-between gap-2 pl-6 flex-wrap">
                <select
                  value={b.category}
                  onChange={e =>
                    handleUpdateBlock(idx, { ...b, category: e.target.value as any })
                  }
                  className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-200 font-medium text-xs flex-1 min-w-[140px] focus:outline-none focus:border-tennis-500"
                >
                  {Object.values(CATEGORY_DEFINITIONS)
                    .filter(c => c.id !== 'unnoticed_time' && c.id !== 'unlogged_missing')
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.shortLabel}
                      </option>
                    ))}
                </select>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="time"
                    value={b.startTime}
                    onChange={e => {
                      const newStart = e.target.value;
                      const dur = calculateDurationHours(newStart, b.endTime);
                      handleUpdateBlock(idx, { ...b, startTime: newStart, durationHours: dur });
                    }}
                    className="bg-slate-800 border border-slate-700 px-1.5 py-1 rounded text-center text-slate-100 font-mono text-xs w-[75px]"
                  />

                  <span className="text-slate-500">-</span>

                  <input
                    type="time"
                    value={b.endTime}
                    onChange={e => {
                      const newEnd = e.target.value;
                      const dur = calculateDurationHours(b.startTime, newEnd);
                      handleUpdateBlock(idx, { ...b, endTime: newEnd, durationHours: dur });
                    }}
                    className="bg-slate-800 border border-slate-700 px-1.5 py-1 rounded text-center text-slate-100 font-mono text-xs w-[75px]"
                  />

                  <span className="text-tennis-400 font-mono font-bold text-xs pl-1">
                    {formatDuration(b.durationHours)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
