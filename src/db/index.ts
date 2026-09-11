import Dexie, { type Table } from 'dexie';
import { ChildProfile, DayLog, TermSchedule } from '../types';
import { createAutumn2026Term } from '../utils/defaultSchedules';

export interface SettingItem {
  key: string;
  value: any;
}

export class TennisTrackerDB extends Dexie {
  profiles!: Table<ChildProfile, string>;
  dayLogs!: Table<DayLog, string>;
  terms!: Table<TermSchedule, string>;
  settings!: Table<SettingItem, string>;

  constructor() {
    super('TennisTrackerDB');
    this.version(1).stores({
      profiles: 'id, name, age',
      dayLogs: 'id, childId, date, status',
      terms: 'id, name, isCurrent',
      settings: 'key',
    });
  }
}

export const db = new TennisTrackerDB();

// Initialize DB with profiles, term, and recent days if empty
export async function initializeDatabase() {
  const profileCount = await db.profiles.count();
  if (profileCount === 0) {
    const defaultProfiles: ChildProfile[] = [
      {
        id: 'kid1',
        name: 'Elder Boy (Kid 1)',
        age: 11,
        birthYear: 2015,
        primarySport: 'Tennis',
        secondarySports: ['Gymnastics', 'Taekwondo', 'Parkour'],
        avatarColor: '#84cc16', // Lime
      },
      {
        id: 'kid2',
        name: 'Younger Boy (Kid 2)',
        age: 10,
        birthYear: 2016,
        primarySport: 'Tennis',
        secondarySports: ['Gymnastics', 'Taekwondo', 'Parkour'],
        avatarColor: '#06b6d4', // Cyan
      },
    ];
    await db.profiles.bulkAdd(defaultProfiles);
  }

  const termCount = await db.terms.count();
  if (termCount === 0) {
    const autumnTerm = createAutumn2026Term();
    await db.terms.add(autumnTerm);
  }

  // Check if we need to seed initial day logs for the current week / month
  const logCount = await db.dayLogs.count();
  if (logCount === 0) {
    const term = await db.terms.get('autumn-2026');
    if (term) {
      const today = new Date();
      const logsToSeed: DayLog[] = [];

      // Seed past 7 days up to today
      const daysOfWeekMap: (keyof TermSchedule['weeklyDefaults']['kid1'])[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = daysOfWeekMap[d.getDay()];

        // Kid 1
        const k1Blocks = (term.weeklyDefaults.kid1[dayOfWeek] || []).map((b, idx) => ({
          ...b,
          id: `log_k1_${dateStr}_${idx}`,
        }));
        logsToSeed.push({
          id: `kid1_${dateStr}`,
          childId: 'kid1',
          date: dateStr,
          status: 'unlogged', // Past un-reviewed days start as Unconfirmed Draft
          blocks: k1Blocks,
          lastModified: Date.now(),
        });

        // Kid 2
        const k2Blocks = (term.weeklyDefaults.kid2[dayOfWeek] || []).map((b, idx) => ({
          ...b,
          id: `log_k2_${dateStr}_${idx}`,
        }));
        logsToSeed.push({
          id: `kid2_${dateStr}`,
          childId: 'kid2',
          date: dateStr,
          status: 'unlogged', // Past un-reviewed days start as Unconfirmed Draft
          blocks: k2Blocks,
          lastModified: Date.now(),
        });
      }

      await db.dayLogs.bulkAdd(logsToSeed);
    }
  }
}
