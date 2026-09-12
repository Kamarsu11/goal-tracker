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
  | 'tennis_focus'        // High-Intensity Tennis (Dad 1:1, Intensive Drills, Tournament Match) - 1.00
  | 'tennis_match'        // Practice Match Play (Competitive Sets, Tiebreak Shootout) - 0.80
  | 'multisport'          // Multisport Athleticism (MAG Gymnastics, Taekwondo, Parkour) - 0.70
  | 'tennis_squad'        // Standard Practice / Squad Tennis (Club Group Training) - 0.60
  | 'tennis_sc_footwork'  // Tennis S&C & Footwork (Agility, Speed Ladders, Core) - 0.60
  | 'mobility_prehab'     // Pre-hab & Injury Prevention (Bands, Foam Rolling, Mobility) - 0.50
  | 'intentional_rest'    // Intentional Rest (Screen-free Active Physical/Mental Recovery) - 0.50
  | 'tennis_iq'           // Tennis IQ & Video Analysis (Match Charting, Tactical Study) - 0.50
  | 'tennis_companion'    // Tactical & Agility Training (Legacy alias, 0.70)
  | 'school'              // School (Mandatory) - 0.00
  | 'study_homework'      // Homework & Study - 0.00
  | 'transit'             // Transit & Travel / Waiting - 0.00
  | 'sleep'               // Sleep & Physical Recovery - 0.00
  | 'dead_time'           // Unplanned Dead Time (Yapping, Idle waiting, Loafing) - 0.00
  | 'guilt_free_fun'      // Guilt-Free Fun / Free Play / Gaming - 0.00
  | 'unnoticed_time'      // Unnoticed / Idle Dead Time (Silent Killer) - 0.00
  | 'unlogged_missing';   // Unrecorded / Incomplete Log Gap - 0.00

export interface CategoryMeta {
  id: ActivityCategory;
  label: string;
  shortLabel: string;
  color: string; // Tailwind color or hex
  bgClass: string;
  textClass: string;
  borderClass: string;
  isProductive: boolean;
  effectiveWeight: number; // Quality points per hour
  description?: string;
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
    weeklyScoreTarget: number; // e.g. 17.60 for age 10, 19.45 for age 11
    dailyScoreTarget: number;  // weeklyScoreTarget / 7
    highIntensityTennisHours: number;
    practiceMatchHours: number;
    squadPracticeHours: number;
    multisportHours: number;
    scFootworkHours: number;
    prehabHours: number;
    intentionalRestHours: number;
    tennisIqHours: number;
    sleepHoursPerNight: number;
    studyHoursPerWeek: number;
  };
}

export interface DailySummary {
  date: string;
  childId: ChildId;
  status: DayStatus;
  totalLoggedHours: number;
  tennisHours: number;
  highIntensityTennisHours: number;
  practiceMatchHours: number;
  squadTennisHours: number;
  effectiveTennisScore: number;
  multisportHours: number;
  scFootworkHours: number;
  mobilityHours: number;
  intentionalRestHours: number;
  tennisIqHours: number;
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
  performanceScore: number; // Percentage vs ideal (e.g. 100%)
}
