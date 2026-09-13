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
}
