import { ActivityCategory, CategoryMeta, ActivityBlock } from '../types';

export const CATEGORY_DEFINITIONS: Record<ActivityCategory, CategoryMeta> = {
  tennis_focus: {
    id: 'tennis_focus',
    label: 'High-Intensity Tennis (Dad 1:1, Intensive Drills, Match)',
    shortLabel: 'High-Intensity Tennis',
    color: '#84cc16', // neon/lime green
    bgClass: 'bg-lime-500/20',
    textClass: 'text-lime-400',
    borderClass: 'border-lime-500/50',
    isProductive: true,
    effectiveWeight: 1.00, // 1.00 pt / hour
    description: '1:1 intensive coach/Dad sessions, basket feeding at high ball speed, serve target volume under match pressure',
  },
  tennis_match: {
    id: 'tennis_match',
    label: 'Practice Match Play (Sets, Tiebreaks)',
    shortLabel: 'Practice Match Play',
    color: '#eab308', // gold/yellow
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/50',
    isProductive: true,
    effectiveWeight: 0.80, // 0.80 pt / hour
    description: 'Practice sets, tiebreak shootouts, match simulations against peers or club partners',
  },
  multisport: {
    id: 'multisport',
    label: 'Multisport Athleticism (MAG Gymnastics, TKD, Parkour)',
    shortLabel: 'Multisport Athleticism',
    color: '#6366f1', // indigo
    bgClass: 'bg-indigo-500/20',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/50',
    isProductive: true,
    effectiveWeight: 0.70, // 0.70 pt / hour
    description: 'Non-tennis sports building core strength, hip mobility, rotational power, and spatial awareness',
  },
  tennis_squad: {
    id: 'tennis_squad',
    label: 'Standard Practice / Squad Tennis (Group Training)',
    shortLabel: 'Squad Practice',
    color: '#10b981', // emerald green
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/50',
    isProductive: true,
    effectiveWeight: 0.60, // 0.60 pt / hour
    description: 'Club group sessions (1:3 or 1:4 with coach), continuous rallying, tactical group drills',
  },
  tennis_sc_footwork: {
    id: 'tennis_sc_footwork',
    label: 'Tennis S&C & Footwork (Agility, Speed Ladders, Core)',
    shortLabel: 'S&C & Footwork',
    color: '#f59e0b', // amber orange
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/50',
    isProductive: true,
    effectiveWeight: 0.60, // 0.60 pt / hour
    description: 'Tennis-specific agility, split-step speed, change-of-direction ladders, core stability, medball throws',
  },
  mobility_prehab: {
    id: 'mobility_prehab',
    label: 'Pre-hab & Injury Prevention (Bands, Foam Roll, Mobility)',
    shortLabel: 'Pre-hab & Injury Prev',
    color: '#ec4899', // pink
    bgClass: 'bg-pink-500/20',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-500/50',
    isProductive: true,
    effectiveWeight: 0.50, // 0.50 pt / hour
    description: 'Shoulder rotator cuff band work, foam rolling, dynamic hip/ankle stretching, post-workout recovery',
  },
  intentional_rest: {
    id: 'intentional_rest',
    label: 'Intentional Rest (Active Recovery, Zero-Screen)',
    shortLabel: 'Intentional Rest',
    color: '#06b6d4', // cyan
    bgClass: 'bg-cyan-500/20',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/50',
    isProductive: true,
    effectiveWeight: 0.50, // 0.50 pt / hour
    description: 'Deliberate screen-free physical/mental recovery: legs-up, breathwork, quiet reading, 20m power nap, Epsom bath',
  },
  tennis_iq: {
    id: 'tennis_iq',
    label: 'Tennis IQ & Video Analysis (Match Charting, Tactics)',
    shortLabel: 'Tennis IQ & Video',
    color: '#38bdf8', // sky blue
    bgClass: 'bg-sky-500/20',
    textClass: 'text-sky-400',
    borderClass: 'border-sky-500/50',
    isProductive: true,
    effectiveWeight: 0.50, // 0.50 pt / hour
    description: 'Match scouting/charting, tactical video breakdown of ATP/WTA pros, stroke analysis',
  },
  tennis_companion: {
    id: 'tennis_companion',
    label: 'Tactical & Agility Training (Legacy)',
    shortLabel: 'Tactical & Agility',
    color: '#06b6d4',
    bgClass: 'bg-cyan-500/20',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/50',
    isProductive: true,
    effectiveWeight: 0.70,
  },
  school: {
    id: 'school',
    label: 'School (Mandatory)',
    shortLabel: 'School',
    color: '#94a3b8', // slate
    bgClass: 'bg-slate-500/20',
    textClass: 'text-slate-300',
    borderClass: 'border-slate-500/50',
    isProductive: false,
    effectiveWeight: 0.00,
  },
  study_homework: {
    id: 'study_homework',
    label: 'Homework & Study',
    shortLabel: 'Study / Homework',
    color: '#a855f7', // purple
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/50',
    isProductive: false,
    effectiveWeight: 0.00,
    description: 'School homework, study time, language practice (essential academic foundation)',
  },
  transit: {
    id: 'transit',
    label: 'Transit & Car Travel / Waiting',
    shortLabel: 'Transit & Wait',
    color: '#f97316', // orange
    bgClass: 'bg-orange-500/20',
    textClass: 'text-orange-400',
    borderClass: 'border-orange-500/50',
    isProductive: false,
    effectiveWeight: 0.00,
  },
  sleep: {
    id: 'sleep',
    label: 'Sleep & Physical Recovery',
    shortLabel: 'Sleep',
    color: '#3b82f6', // blue
    bgClass: 'bg-blue-500/20',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/50',
    isProductive: false,
    effectiveWeight: 0.00,
  },
  guilt_free_fun: {
    id: 'guilt_free_fun',
    label: 'Guilt-Free Free Play / Gaming / Chill',
    shortLabel: 'Guilt-Free Free Play',
    color: '#14b8a6', // teal
    bgClass: 'bg-teal-500/20',
    textClass: 'text-teal-400',
    borderClass: 'border-teal-500/50',
    isProductive: false,
    effectiveWeight: 0.00,
    description: 'Unstructured entertainment, gaming, social relaxation with family/friends (healthy mental decompression)',
  },
  unnoticed_time: {
    id: 'unnoticed_time',
    label: 'Unnoticed / Idle Dead Time (Wastage)',
    shortLabel: 'Unnoticed Time',
    color: '#ef4444', // red
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/50',
    isProductive: false,
    effectiveWeight: 0.00,
  },
  unlogged_missing: {
    id: 'unlogged_missing',
    label: 'Unrecorded / Incomplete Log Gap',
    shortLabel: 'Unlogged Gap',
    color: '#64748b', // gray hatched
    bgClass: 'bg-slate-700/30',
    textClass: 'text-slate-400',
    borderClass: 'border-dashed border-slate-600',
    isProductive: false,
    effectiveWeight: 0.00,
  },
};

/**
 * Converts 'HH:MM' string to decimal hours (0 to 24)
 */
export function timeStringToHours(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h + m / 60;
}

/**
 * Converts decimal hours to 'HH:MM' string
 */
export function hoursToTimeString(hours: number): string {
  const normalized = Math.max(0, Math.min(24, hours));
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  const clampedH = h === 24 && m > 0 ? 23 : h;
  const clampedM = h === 24 && m > 0 ? 59 : m % 60;
  return `${clampedH.toString().padStart(2, '0')}:${clampedM.toString().padStart(2, '0')}`;
}

/**
 * Calculates duration between two 'HH:MM' times in decimal hours
 */
export function calculateDurationHours(startTime: string, endTime: string): number {
  const start = timeStringToHours(startTime);
  const end = timeStringToHours(endTime);
  if (end >= start) {
    return parseFloat((end - start).toFixed(2));
  }
  // Crosses midnight
  return parseFloat((24 - start + end).toFixed(2));
}

/**
 * Formats duration in hours to friendly "Xh Ym"
 */
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Adjusts a time string by a given number of minutes (+15, -15, etc.)
 */
export function adjustTimeString(timeStr: string, deltaMinutes: number): string {
  let [h, m] = timeStr.split(':').map(Number);
  let totalMinutes = h * 60 + m + deltaMinutes;
  
  if (totalMinutes < 0) totalMinutes = 0;
  if (totalMinutes > 24 * 60) totalMinutes = 24 * 60;

  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

/**
 * Analyzes a day's blocks and returns 24-hour coverage and gaps
 */
export interface DayCoverage {
  totalLoggedHours: number;
  gapHours: number;
  categoryTotals: Record<ActivityCategory, number>;
  effectiveTennisScore: number;
}

export function computeDayCoverage(blocks: ActivityBlock[], isDayConfirmed: boolean): DayCoverage {
  const categoryTotals: Record<ActivityCategory, number> = {
    tennis_focus: 0,
    tennis_match: 0,
    multisport: 0,
    tennis_squad: 0,
    tennis_sc_footwork: 0,
    mobility_prehab: 0,
    intentional_rest: 0,
    tennis_iq: 0,
    tennis_companion: 0,
    school: 0,
    study_homework: 0,
    transit: 0,
    sleep: 0,
    guilt_free_fun: 0,
    unnoticed_time: 0,
    unlogged_missing: 0,
  };

  let totalLogged = 0;
  let effectiveTennis = 0;

  for (const block of blocks) {
    if (block.isCancelled || !block.completed) continue;
    const dur = block.durationHours || calculateDurationHours(block.startTime, block.endTime);
    if (categoryTotals[block.category] !== undefined) {
      categoryTotals[block.category] += dur;
    }
    totalLogged += dur;

    // Calculate effective weight
    const meta = CATEGORY_DEFINITIONS[block.category];
    if (meta && meta.effectiveWeight > 0) {
      effectiveTennis += dur * meta.effectiveWeight;
    }
  }

  const gapHours = Math.max(0, parseFloat((24.0 - totalLogged).toFixed(2)));

  // If confirmed, unallocated hours are noticed as unnoticed idle time.
  // If unconfirmed or partial, gaps are flagged as unlogged missing.
  if (gapHours > 0) {
    if (isDayConfirmed) {
      categoryTotals.unnoticed_time = gapHours;
    } else {
      categoryTotals.unlogged_missing = gapHours;
    }
  }

  return {
    totalLoggedHours: parseFloat(totalLogged.toFixed(2)),
    gapHours,
    categoryTotals,
    effectiveTennisScore: parseFloat(effectiveTennis.toFixed(2)),
  };
}
