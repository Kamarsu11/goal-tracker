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
    <div className="bg-brand-card border border-brand-border rounded-2xl p-3.5 shadow-lg space-y-3">
      {/* Top row: Date navigation & Kid Indicator */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevDay}
            className="p-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 active:scale-95 transition-all"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToday}
            className={`px-2.5 py-1 rounded-xl border text-xs font-semibold active:scale-95 transition-all ${
              isToday
                ? 'bg-tennis-500/20 border-tennis-500/50 text-tennis-400'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Today
          </button>

          <button
            onClick={handleNextDay}
            className="p-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 active:scale-95 transition-all"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Date Selector and Confirmation Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-xl shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-tennis-400 shrink-0" />
            <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">
              {currentProfile.name}:
            </span>
            <input
              type="date"
              value={currentDate}
              onChange={e => e.target.value && onDateChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-100 cursor-pointer focus:outline-none [color-scheme:dark]"
            />
          </div>

          <button
            onClick={onToggleStatus}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold shadow active:scale-95 transition-all text-xs border ${
              dayLog.status === 'confirmed'
                ? 'bg-emerald-950/70 hover:bg-emerald-900/80 border-emerald-700 text-emerald-300'
                : 'bg-tennis-500 hover:bg-tennis-400 border-tennis-400 text-black'
            }`}
            title={dayLog.status === 'confirmed' ? 'Day is Confirmed (Click to set as Draft)' : 'Click to confirm this day'}
          >
            {dayLog.status === 'confirmed' ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confirmed</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Confirm Day</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Tags & Quick Action Presets in one streamlined bar */}
      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-brand-border/40 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onApplyPreset('default_term')}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-tennis-500 text-slate-300 rounded-lg text-[11px] font-medium active:scale-95 transition-all"
            title={`Load standard recurring schedule for ${dayOfWeek}`}
          >
            <Zap className="w-3 h-3 text-tennis-400" />
            <span>Load Default</span>
          </button>

          <button
            onClick={() => onApplyPreset('match_day')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium active:scale-95 transition-all border ${
              dayLog.isMatchDay
                ? 'bg-yellow-950/60 border-yellow-700 text-yellow-300'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span>Match</span>
          </button>

          <button
            onClick={() => onApplyPreset('school_holiday')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium active:scale-95 transition-all border ${
              dayLog.isSchoolHoliday
                ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <SunMedium className="w-3 h-3 text-cyan-400" />
            <span>Holiday</span>
          </button>

          <button
            onClick={() => onApplyPreset('sick_day')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium active:scale-95 transition-all border ${
              dayLog.isSick
                ? 'bg-red-950/60 border-red-700 text-red-300'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <Thermometer className="w-3 h-3 text-red-400" />
            <span>Sick</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {otherProfile && (
            <button
              onClick={onCopyToSibling}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-800/60 text-indigo-300 rounded-lg text-[11px] font-medium active:scale-95 transition-all"
              title={`Copy this day's schedule to ${otherProfile.name}`}
            >
              <Copy className="w-3 h-3 text-indigo-400" />
              <span>Copy to {otherProfile.name.split(' ')[0]}</span>
            </button>
          )}

          <button
            onClick={onClearDay}
            className="p-1 bg-slate-900/90 hover:bg-red-950/60 border border-slate-800 hover:border-red-800 text-slate-500 hover:text-red-400 rounded-lg transition-all"
            title="Clear all blocks"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
