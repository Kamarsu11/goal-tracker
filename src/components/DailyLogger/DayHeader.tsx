import React from 'react';
import { ChildProfile, DayLog, DayStatus } from '../../types';
import { getDayOfWeekFromDate } from '../../services/dataService';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Zap,
  Copy,
  Trash2,
  CheckCircle,
  Thermometer,
  SunMedium,
  Trophy,
  AlertTriangle,
} from 'lucide-react';

interface DayHeaderProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  currentProfile: ChildProfile;
  otherProfile?: ChildProfile;
  dayLog: DayLog;
  onApplyPreset: (preset: 'default_term' | 'school_holiday' | 'sick_day' | 'match_day') => void;
  onCopyToSibling: () => void;
  onClearDay: () => void;
  onToggleStatus: () => void;
}

export const DayHeader: React.FC<DayHeaderProps> = ({
  currentDate,
  onDateChange,
  currentProfile,
  otherProfile,
  dayLog,
  onApplyPreset,
  onCopyToSibling,
  onClearDay,
  onToggleStatus,
}) => {
  const dayOfWeek = getDayOfWeekFromDate(currentDate);

  const formattedDate = new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrevDay = () => {
    const d = new Date(currentDate + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  const isToday = currentDate === new Date().toISOString().split('T')[0];

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-4">
      {/* Top row: Date navigation & Child identifier */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevDay}
            className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 active:scale-95 transition-all"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToday}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold active:scale-95 transition-all ${
              isToday
                ? 'bg-tennis-500/20 border-tennis-500/50 text-tennis-400'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Today
          </button>

          <button
            onClick={handleNextDay}
            className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 active:scale-95 transition-all"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Visible Date Picker & Display */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-tennis-500/60 px-3 py-1.5 rounded-xl transition-all shadow-inner">
            <Calendar className="w-4 h-4 text-tennis-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">
                {currentProfile.name}
              </span>
              <input
                type="date"
                value={currentDate}
                onChange={e => e.target.value && onDateChange(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-100 cursor-pointer focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert / Indicator Banner */}
      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-brand-border/60 text-xs flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-400">Status:</span>
          {dayLog.status === 'confirmed' && (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Confirmed
            </span>
          )}
          {dayLog.status === 'unlogged' && (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-md font-semibold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> Unconfirmed Draft
            </span>
          )}
          {dayLog.isSick && (
            <span className="flex items-center gap-1 text-red-400 bg-red-950/60 border border-red-800 px-2 py-0.5 rounded-md font-semibold">
              <Thermometer className="w-3.5 h-3.5" /> Sick / Fever Rest
            </span>
          )}
          {dayLog.isSchoolHoliday && (
            <span className="flex items-center gap-1 text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded-md font-semibold">
              <SunMedium className="w-3.5 h-3.5" /> School Holiday
            </span>
          )}
          {dayLog.isMatchDay && (
            <span className="flex items-center gap-1 text-yellow-400 bg-yellow-950/60 border border-yellow-800 px-2 py-0.5 rounded-md font-semibold">
              <Trophy className="w-3.5 h-3.5" /> Match Day
            </span>
          )}
        </div>

        {/* 1-Tap Toggle between Confirmed & Unconfirmed Draft */}
        <button
          onClick={onToggleStatus}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold shadow-md active:scale-95 transition-all text-xs border ${
            dayLog.status === 'confirmed'
              ? 'bg-slate-900 hover:bg-slate-800 border-amber-500/50 text-amber-300'
              : 'bg-tennis-500 hover:bg-tennis-400 border-tennis-400 text-black'
          }`}
          title={dayLog.status === 'confirmed' ? 'Click to change back to Unconfirmed Draft' : 'Click to confirm this day'}
        >
          {dayLog.status === 'confirmed' ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Set as Draft</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Confirm Day</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Presets & Sibling Actions Bar */}
      <div className="space-y-2 pt-1 border-t border-brand-border/40">
        <div className="text-[11px] font-medium text-slate-400">Quick Daily Presets & Actions:</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onApplyPreset('default_term')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-tennis-500 text-slate-200 rounded-xl text-xs font-medium active:scale-95 transition-all"
            title={`Load standard recurring schedule for ${dayOfWeek}`}
          >
            <Zap className="w-3.5 h-3.5 text-tennis-400" />
            <span>Load Default Schedule</span>
          </button>

          <button
            onClick={() => onApplyPreset('match_day')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-slate-200 rounded-xl text-xs font-medium active:scale-95 transition-all"
            title="Load 5h Match Day block"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Match Day</span>
          </button>

          <button
            onClick={() => onApplyPreset('school_holiday')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-200 rounded-xl text-xs font-medium active:scale-95 transition-all"
            title="School is off"
          >
            <SunMedium className="w-3.5 h-3.5 text-cyan-400" />
            <span>Holiday</span>
          </button>

          <button
            onClick={() => onApplyPreset('sick_day')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-red-500 text-slate-200 rounded-xl text-xs font-medium active:scale-95 transition-all"
            title="Sick / Fever Rest mode"
          >
            <Thermometer className="w-3.5 h-3.5 text-red-400" />
            <span>Sick / Rest</span>
          </button>

          {otherProfile && (
            <button
              onClick={onCopyToSibling}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 rounded-xl text-xs font-semibold active:scale-95 transition-all ml-auto"
              title={`Copy this day's schedule to ${otherProfile.name}`}
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Copy to {otherProfile.name.split(' ')[0]}</span>
            </button>
          )}

          <button
            onClick={onClearDay}
            className="flex items-center gap-1 px-2 py-1.5 bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-800 text-slate-400 hover:text-red-400 rounded-xl text-xs active:scale-95 transition-all"
            title="Clear all blocks for this day"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Day</span>
          </button>
        </div>
      </div>
    </div>
  );
};
