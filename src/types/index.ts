export type ChildId = 'kid1' | 'kid2' | string;

export interface ChildProfile {
  id: ChildId;
  name: string;
  age: number;
  birthYear: number;
  primarySport: string;
  secondarySports: string[];
  avatarColor: string;
}

export type ActivityCategory =
  | 'tennis_focus'      // High-Intensity Tennis (Match / Dad 1:1 / Serves)
  | 'tennis_squad'      // Standard Practice Tennis (Group / Light Practice)
  | 'tennis_match'      // Match Play / Tournament
  | 'tennis_companion'  // Tactical & Agility Training (Footwork / Charting / Video)
  | 'tennis_iq'         // Tennis IQ & Video Analysis
  | 'multisport'        // Multisport Athleticism (Gymnastics / TKD / Parkour)
  | 'mobility_prehab'   // Mobility, Foam Roll & Injury Pre-hab
  | 'school'            // School (Mandatory)
  | 'study_homework'    // Homework & Study
  | 'transit'           // Transit & Travel / Waiting
  | 'sleep'             // Sleep & Physical Recovery
  | 'guilt_free_fun'    // Guilt-Free Fun / Gaming / Chill
  | 'unnoticed_time'    // Unnoticed / Idle Dead Time (Silent Killer)
  | 'unlogged_missing'; // Unrecorded / Incomplete Log Gap

export interface CategoryMeta {
  id: ActivityCategory;
  label: string;
  shortLabel: string;
  color: string; // Tailwind color or hex
  bgClass: string;
  textClass: string;
  borderClass: string;
  isProductive: boolean;
  effectiveWeight: number; // For Quality Tennis Score index
}

export interface ActivityBlock {
  id: string;
  category: ActivityCategory;
  title: string;
  startTime: string; // 'HH:MM' 24h
  endTime: string;   // 'HH:MM' 24h
  durationHours: number;
  completed: boolean;
  notes?: string;
  isCancelled?: boolean;
  subCategory?: string;
}

export type DayStatus = 'confirmed' | 'partial' | 'unlogged' | 'sick' | 'holiday' | 'match_day';

export interface DayLog {
  id: string; // `${childId}_${date}`
  childId: ChildId;
  date: string; // YYYY-MM-DD
  status: DayStatus;
  blocks: ActivityBlock[];
  notes?: string;
  isSick?: boolean;
  isSchoolHoliday?: boolean;
  isMatchDay?: boolean;
  lastModified: number;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TermSchedule {
  id: string;
  name: string; // e.g. "Autumn Term 2026 (Aug - Dec)"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  dayLabels?: Partial<Record<DayOfWeek, string>>; // Editable names like "Monday (Gymnastics)"
  weeklyDefaults: {
    kid1: Record<DayOfWeek, ActivityBlock[]>;
    kid2: Record<DayOfWeek, ActivityBlock[]>;
  };
}

export interface AgeIdealBenchmark {
  age: number;
  weeklyTargets: {
    tennisTotalHours: number;
    tennisFocusRatio: number; // % of tennis that should be 1:1 / match play
    multisportHours: number;
    mobilityHours: number;
    tennisIqHours: number;
    sleepHoursPerNight: number;
    studyHours: number;
    maxGuiltFreeLeisureHours: number;
    maxUnnoticedHoursPerWeek: number;
  };
}

export interface DailySummary {
  date: string;
  childId: ChildId;
  status: DayStatus;
  totalLoggedHours: number;
  tennisHours: number;
  effectiveTennisScore: number;
  multisportHours: number;
  mobilityHours: number;
  transitHours: number;
  schoolHours: number;
  studyHours: number;
  sleepHours: number;
  guiltFreeFunHours: number;
  unnoticedHours: number;
  unloggedHours: number;
  idealTennisTarget: number;
  idealMultisportTarget: number;
  idealSleepTarget: number;
  idealScoreTarget: number;
  performanceScore: number; // 0 - 100+
}
