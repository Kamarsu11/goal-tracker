import { db } from '../db';
import {
  DayLog,
  ChildProfile,
  TermSchedule,
  DayOfWeek,
  ActivityBlock,
  DailySummary,
  ChildId,
} from '../types';
import {
  calculateDurationHours,
  computeDayCoverage,
  adjustTimeString,
} from '../utils/categories';
import { calculateIdealForDay, getBenchmarkForAge } from '../utils/defaultSchedules';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function getDayOfWeekFromDate(dateStr: string): DayOfWeek {
  const d = new Date(dateStr + 'T12:00:00');
  return DAYS_OF_WEEK[d.getDay()];
}

export const DataService = {
  // Profiles
  async getProfiles(): Promise<ChildProfile[]> {
    return db.profiles.toArray();
  },

  async updateProfile(profile: ChildProfile): Promise<void> {
    await db.profiles.put(profile);
  },

  // Terms & Defaults
  async getCurrentTerm(): Promise<TermSchedule | undefined> {
    const term = await db.terms.filter(t => t.isCurrent).first();
    if (term) return term;
    return db.terms.get('autumn-2026');
  },

  async getAllTerms(): Promise<TermSchedule[]> {
    return db.terms.toArray();
  },

  async saveTerm(term: TermSchedule): Promise<void> {
    await db.terms.put(term);
  },

  // Day Logs
  async getDayLog(childId: ChildId, dateStr: string): Promise<DayLog | undefined> {
    const id = `${childId}_${dateStr}`;
    return db.dayLogs.get(id);
  },

  async saveDayLog(log: DayLog): Promise<void> {
    log.lastModified = Date.now();
    await db.dayLogs.put(log);
  },

  async getLogsForDateRange(childId: ChildId, startDate: string, endDate: string): Promise<DayLog[]> {
    return db.dayLogs
      .where('childId')
      .equals(childId)
      .and(log => log.date >= startDate && log.date <= endDate)
      .sortBy('date');
  },

  async getAllLogs(): Promise<DayLog[]> {
    return db.dayLogs.toArray();
  },

  // Generate or Load a Day - defaults to empty unless user clicks Load Preset
  async loadOrCreateDay(childId: ChildId, dateStr: string): Promise<DayLog> {
    const existing = await this.getDayLog(childId, dateStr);
    if (existing) return existing;

    const newLog: DayLog = {
      id: `${childId}_${dateStr}`,
      childId,
      date: dateStr,
      status: 'unlogged',
      blocks: [], // Empty by default
      lastModified: Date.now(),
    };

    await db.dayLogs.put(newLog);
    return newLog;
  },

  // 1-Tap Copy Day to Sibling
  async copyDayToSibling(fromChildId: ChildId, toChildId: ChildId, dateStr: string): Promise<DayLog> {
    const sourceLog = await this.getDayLog(fromChildId, dateStr);
    if (!sourceLog) {
      throw new Error('Source day log not found');
    }

    const dayOfWeek = getDayOfWeekFromDate(dateStr);

    // Deep copy blocks and adjust kid-specific defaults (e.g. Tuesday & Friday school dismissals)
    const newBlocks: ActivityBlock[] = sourceLog.blocks.map((block, idx) => {
      let blockCopy = {
        ...block,
        id: `blk_${dateStr}_${toChildId}_${idx}_${Date.now()}`,
      };

      // Tuesday difference: younger boy ends at 14:20
      if (dayOfWeek === 'tuesday' && block.category === 'school') {
        if (toChildId === 'kid2') {
          blockCopy.title = 'School (Finishes 14:20 for Younger)';
          blockCopy.endTime = '14:20';
          blockCopy.durationHours = calculateDurationHours(blockCopy.startTime, '14:20');
        } else {
          blockCopy.title = 'School';
          blockCopy.endTime = '15:05';
          blockCopy.durationHours = calculateDurationHours(blockCopy.startTime, '15:05');
        }
      }

      // Friday difference: elder boy ends at 14:20
      if (dayOfWeek === 'friday' && block.category === 'school') {
        if (toChildId === 'kid1') {
          blockCopy.title = 'School (Finishes 14:20 for Elder)';
          blockCopy.endTime = '14:20';
          blockCopy.durationHours = calculateDurationHours(blockCopy.startTime, '14:20');
        } else {
          blockCopy.title = 'School (Full day till 15:05)';
          blockCopy.endTime = '15:05';
          blockCopy.durationHours = calculateDurationHours(blockCopy.startTime, '15:05');
        }
      }

      return blockCopy;
    });

    const targetLog: DayLog = {
      id: `${toChildId}_${dateStr}`,
      childId: toChildId,
      date: dateStr,
      status: sourceLog.status,
      blocks: newBlocks,
      notes: sourceLog.notes ? `[Copied from ${fromChildId}] ${sourceLog.notes}` : undefined,
      isSick: sourceLog.isSick,
      isSchoolHoliday: sourceLog.isSchoolHoliday,
      isMatchDay: sourceLog.isMatchDay,
      lastModified: Date.now(),
    };

    await db.dayLogs.put(targetLog);
    return targetLog;
  },

  // Clear Day
  async clearDay(childId: ChildId, dateStr: string): Promise<DayLog> {
    const emptyLog: DayLog = {
      id: `${childId}_${dateStr}`,
      childId,
      date: dateStr,
      status: 'unlogged',
      blocks: [],
      notes: '',
      isSick: false,
      isSchoolHoliday: false,
      isMatchDay: false,
      lastModified: Date.now(),
    };
    await db.dayLogs.put(emptyLog);
    return emptyLog;
  },

  // Apply quick preset to Day
  async applyPreset(
    childId: ChildId,
    dateStr: string,
    preset: 'default_term' | 'school_holiday' | 'sick_day' | 'match_day'
  ): Promise<DayLog> {
    const dayOfWeek = getDayOfWeekFromDate(dateStr);
    const term = await this.getCurrentTerm();
    const kidKey = childId === 'kid2' ? 'kid2' : 'kid1';

    let blocks: ActivityBlock[] = (term?.weeklyDefaults[kidKey]?.[dayOfWeek] || []).map(
      (b, idx) => ({
        ...b,
        id: `blk_${dateStr}_${childId}_${idx}_${Date.now()}`,
        durationHours: b.durationHours || calculateDurationHours(b.startTime, b.endTime),
        completed: true,
      })
    );

    let isSick = false;
    let isSchoolHoliday = false;
    let isMatchDay = false;
    let status: DayLog['status'] = 'confirmed';

    if (preset === 'school_holiday') {
      isSchoolHoliday = true;
      // Remove school block and add guilt-free + morning tennis
      blocks = blocks.filter(b => b.category !== 'school');
      blocks.push({
        id: `blk_holiday_fun_${Date.now()}`,
        category: 'guilt_free_fun',
        title: 'Holiday Outdoor Play & Free Relaxation',
        startTime: '09:00',
        endTime: '15:00',
        durationHours: 6.0,
        completed: true,
      });
    } else if (preset === 'sick_day') {
      isSick = true;
      status = 'sick';
      blocks = [
        {
          id: `blk_sick_sleep_${Date.now()}`,
          category: 'sleep',
          title: 'Recovery Sleep & Bed Rest',
          startTime: '00:00',
          endTime: '12:00',
          durationHours: 12.0,
          completed: true,
        },
        {
          id: `blk_sick_rest_${Date.now()}`,
          category: 'guilt_free_fun',
          title: 'Quiet Rest, Hydration & Light Reading',
          startTime: '12:00',
          endTime: '21:00',
          durationHours: 9.0,
          completed: true,
        },
        {
          id: `blk_sick_night_${Date.now()}`,
          category: 'sleep',
          title: 'Night Sleep',
          startTime: '21:00',
          endTime: '24:00',
          durationHours: 3.0,
          completed: true,
        },
      ];
    } else if (preset === 'match_day') {
      isMatchDay = true;
      status = 'confirmed';
      blocks = [
        {
          id: `blk_match_sleep_${Date.now()}`,
          category: 'sleep',
          title: 'Night Sleep (Cont. from Prev)',
          startTime: '00:00',
          endTime: '07:30',
          durationHours: 7.5,
          completed: true,
        },
        {
          id: `blk_match_morn_${Date.now()}`,
          category: 'guilt_free_fun',
          title: 'Wake up, Match Nutrition & Prep',
          startTime: '07:30',
          endTime: '08:30',
          durationHours: 1.0,
          completed: true,
        },
        {
          id: `blk_match_trans1_${Date.now()}`,
          category: 'transit',
          title: 'Drive to Tournament Venue',
          startTime: '08:30',
          endTime: '09:15',
          durationHours: 0.75,
          completed: true,
        },
        {
          id: `blk_match_play_${Date.now()}`,
          category: 'tennis_match',
          title: '🎾 Tournament Match Play (Warmup + 2 Sets)',
          startTime: '09:15',
          endTime: '12:30',
          durationHours: 3.25,
          completed: true,
        },
        {
          id: `blk_match_trans2_${Date.now()}`,
          category: 'transit',
          title: 'Drive Home & Lunch',
          startTime: '12:30',
          endTime: '13:30',
          durationHours: 1.0,
          completed: true,
        },
        {
          id: `blk_match_homework_${Date.now()}`,
          category: 'study_homework',
          title: 'School Homework',
          startTime: '13:30',
          endTime: '14:30',
          durationHours: 1.0,
          completed: true,
        },
        {
          id: `blk_match_fun_${Date.now()}`,
          category: 'guilt_free_fun',
          title: 'Post-Match Relaxation & Gaming',
          startTime: '14:30',
          endTime: '19:30',
          durationHours: 5.0,
          completed: true,
        },
        {
          id: `blk_match_dinner_${Date.now()}`,
          category: 'guilt_free_fun',
          title: 'Dinner & Family Time',
          startTime: '19:30',
          endTime: '20:30',
          durationHours: 1.0,
          completed: true,
        },
        {
          id: `blk_match_prehab_${Date.now()}`,
          category: 'mobility_prehab',
          title: 'Post-Match Foam Roll & Ice/Stretches',
          startTime: '20:30',
          endTime: '21:30',
          durationHours: 1.0,
          completed: true,
        },
        {
          id: `blk_match_sleep_night_${Date.now()}`,
          category: 'sleep',
          title: 'Night Sleep',
          startTime: '21:30',
          endTime: '24:00',
          durationHours: 2.5,
          completed: true,
        },
      ];
    }

    const updatedLog: DayLog = {
      id: `${childId}_${dateStr}`,
      childId,
      date: dateStr,
      status,
      blocks,
      isSick,
      isSchoolHoliday,
      isMatchDay,
      lastModified: Date.now(),
    };

    await db.dayLogs.put(updatedLog);
    return updatedLog;
  },

  // Calculate Daily Summary with Dynamic Ideal Comparison
  calculateDailySummary(log: DayLog, childProfile: ChildProfile): DailySummary {
    const isConfirmed = log.status === 'confirmed' || log.status === 'sick';
    const coverage = computeDayCoverage(log.blocks, isConfirmed);
    const dayOfWeek = getDayOfWeekFromDate(log.date);

    // If day is unconfirmed / unlogged, return 0 for actuals and 0 for targets so unconfirmed days do not show on charts
    if (!isConfirmed) {
      return {
        date: log.date,
        childId: log.childId,
        status: log.status,
        totalLoggedHours: 0,
        tennisHours: 0,
        effectiveTennisScore: 0,
        multisportHours: 0,
        mobilityHours: 0,
        transitHours: 0,
        schoolHours: 0,
        studyHours: 0,
        sleepHours: 0,
        guiltFreeFunHours: 0,
        unnoticedHours: 0,
        unloggedHours: 24.0,
        idealTennisTarget: 0,
        idealMultisportTarget: 0,
        idealSleepTarget: 0,
        idealScoreTarget: 0,
        performanceScore: 0,
      };
    }

    // Detect cancelled activities
    const hasCancelledGym = log.blocks.some(b => b.isCancelled && b.category === 'multisport');
    const hasCancelledTennis = log.blocks.some(b => b.isCancelled && b.category.startsWith('tennis'));
    const hasCancelledParkour = log.blocks.some(b => b.isCancelled && b.title.toLowerCase().includes('parkour'));
    const hasCancelledTKD = log.blocks.some(b => b.isCancelled && b.title.toLowerCase().includes('taekwondo'));

    const ideal = calculateIdealForDay(dayOfWeek, childProfile.age, {
      isSick: log.isSick,
      isSchoolHoliday: log.isSchoolHoliday,
      isMatchDay: log.isMatchDay,
      hasCancelledGymnastics: hasCancelledGym,
      hasCancelledTennis: hasCancelledTennis,
      hasCancelledParkour: hasCancelledParkour,
      hasCancelledTKD: hasCancelledTKD,
    });

    const tennisTotal =
      coverage.categoryTotals.tennis_focus +
      coverage.categoryTotals.tennis_squad +
      coverage.categoryTotals.tennis_match +
      coverage.categoryTotals.tennis_companion +
      coverage.categoryTotals.tennis_iq;

    let performanceScore = 100;
    if (!log.isSick && ideal.effectiveScoreTarget > 0) {
      performanceScore = Math.min(150, Math.round((coverage.effectiveTennisScore / ideal.effectiveScoreTarget) * 100));
    }

    return {
      date: log.date,
      childId: log.childId,
      status: log.status,
      totalLoggedHours: coverage.totalLoggedHours,
      tennisHours: parseFloat(tennisTotal.toFixed(2)),
      effectiveTennisScore: coverage.effectiveTennisScore,
      multisportHours: parseFloat(coverage.categoryTotals.multisport.toFixed(2)),
      mobilityHours: parseFloat(coverage.categoryTotals.mobility_prehab.toFixed(2)),
      transitHours: parseFloat(coverage.categoryTotals.transit.toFixed(2)),
      schoolHours: parseFloat(coverage.categoryTotals.school.toFixed(2)),
      studyHours: parseFloat(coverage.categoryTotals.study_homework.toFixed(2)),
      sleepHours: parseFloat(coverage.categoryTotals.sleep.toFixed(2)),
      guiltFreeFunHours: parseFloat(coverage.categoryTotals.guilt_free_fun.toFixed(2)),
      unnoticedHours: parseFloat(coverage.categoryTotals.unnoticed_time.toFixed(2)),
      unloggedHours: parseFloat(coverage.categoryTotals.unlogged_missing.toFixed(2)),
      idealTennisTarget: ideal.tennisHours,
      idealMultisportTarget: ideal.multisportHours,
      idealSleepTarget: ideal.sleepHours,
      idealScoreTarget: ideal.effectiveScoreTarget,
      performanceScore,
    };
  },

  // Export JSON Backup
  async exportJSONBackup(): Promise<string> {
    const profiles = await db.profiles.toArray();
    const dayLogs = await db.dayLogs.toArray();
    const terms = await db.terms.toArray();
    const settings = await db.settings.toArray();

    const backupData = {
      version: 1,
      appName: 'TennisProGoalTracker',
      exportedAt: new Date().toISOString(),
      profiles,
      dayLogs,
      terms,
      settings,
    };

    return JSON.stringify(backupData, null, 2);
  },

  // Import JSON Backup
  async importJSONBackup(jsonString: string): Promise<{ success: boolean; message: string }> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.profiles || !data.dayLogs) {
        throw new Error('Invalid backup file format.');
      }

      await db.transaction('rw', [db.profiles, db.dayLogs, db.terms, db.settings], async () => {
        if (data.profiles.length > 0) {
          await db.profiles.clear();
          await db.profiles.bulkAdd(data.profiles);
        }
        if (data.dayLogs.length > 0) {
          await db.dayLogs.clear();
          await db.dayLogs.bulkAdd(data.dayLogs);
        }
        if (data.terms && data.terms.length > 0) {
          await db.terms.clear();
          await db.terms.bulkAdd(data.terms);
        }
        if (data.settings && data.settings.length > 0) {
          await db.settings.clear();
          await db.settings.bulkAdd(data.settings);
        }
      });

      return { success: true, message: `Successfully restored ${data.dayLogs.length} day logs!` };
    } catch (err: any) {
      return { success: false, message: `Import failed: ${err.message}` };
    }
  },

  // Export CSV for Excel/Google Sheets
  async exportCSV(): Promise<string> {
    const logs = await db.dayLogs.toArray();
    const profiles = await db.profiles.toArray();
    const profileMap = new Map(profiles.map(p => [p.id, p]));

    const headers = [
      'Date',
      'Day of Week',
      'Child Name',
      'Age',
      'Status',
      'Total Logged (h)',
      'High-Intensity Tennis (h)',
      'Standard Practice Tennis (h)',
      'Tactical & Agility Training (h)',
      'Total Tennis (h)',
      'Ideal Tennis Target (h)',
      'Multisport (h)',
      'Mobility & Prehab (h)',
      'Transit & Waiting (h)',
      'School (h)',
      'Study / Homework (h)',
      'Sleep (h)',
      'Guilt-Free Fun (h)',
      'Unnoticed Dead Time (h)',
      'Unlogged Missing Gap (h)',
      'Effective Athletic Score (pts)',
      'Ideal Score Target (pts)',
      'Performance %',
      'Notes',
    ];

    const rows: string[] = [headers.join(',')];

    for (const log of logs) {
      const profile = profileMap.get(log.childId) || ({
        id: log.childId,
        name: log.childId,
        age: 11,
      } as ChildProfile);

      const isConfirmed = log.status === 'confirmed' || log.status === 'sick';
      const coverage = computeDayCoverage(log.blocks, isConfirmed);
      const summary = this.calculateDailySummary(log, profile);
      const dayOfWeek = getDayOfWeekFromDate(log.date);

      const highIntensityTennis = (coverage.categoryTotals.tennis_focus || 0) + (coverage.categoryTotals.tennis_match || 0);
      const standardPracticeTennis = coverage.categoryTotals.tennis_squad || 0;
      const tacticalAgilityTennis = (coverage.categoryTotals.tennis_companion || 0) + (coverage.categoryTotals.tennis_iq || 0);

      const row = [
        log.date,
        dayOfWeek,
        `"${profile.name}"`,
        profile.age,
        log.status,
        summary.totalLoggedHours.toFixed(2),
        highIntensityTennis.toFixed(2),
        standardPracticeTennis.toFixed(2),
        tacticalAgilityTennis.toFixed(2),
        summary.tennisHours.toFixed(2),
        summary.idealTennisTarget.toFixed(2),
        summary.multisportHours.toFixed(2),
        summary.mobilityHours.toFixed(2),
        summary.transitHours.toFixed(2),
        summary.schoolHours.toFixed(2),
        summary.studyHours.toFixed(2),
        summary.sleepHours.toFixed(2),
        summary.guiltFreeFunHours.toFixed(2),
        summary.unnoticedHours.toFixed(2),
        summary.unloggedHours.toFixed(2),
        summary.effectiveTennisScore.toFixed(2),
        summary.idealScoreTarget.toFixed(2),
        summary.performanceScore,
        `"${(log.notes || '').replace(/"/g, '""')}"`,
      ];

      rows.push(row.join(','));
    }

    return rows.join('\n');
  },
};
