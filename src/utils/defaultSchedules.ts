import { ActivityBlock, DayOfWeek, TermSchedule, AgeIdealBenchmark } from '../types';

export const AGE_BENCHMARKS: Record<number, AgeIdealBenchmark> = {
  10: {
    age: 10,
    weeklyTargets: {
      tennisTotalHours: 12.0,
      tennisFocusRatio: 0.6, // 60% should be focused/match
      multisportHours: 10.0,
      mobilityHours: 2.5,
      tennisIqHours: 1.5,
      sleepHoursPerNight: 9.75, // ~68 hrs/week
      studyHours: 3.0,
      maxGuiltFreeLeisureHours: 14.0, // ~2 hrs/day
      maxUnnoticedHoursPerWeek: 8.0,
    },
  },
  11: {
    age: 11,
    weeklyTargets: {
      tennisTotalHours: 13.5,
      tennisFocusRatio: 0.65,
      multisportHours: 10.0,
      mobilityHours: 3.0,
      tennisIqHours: 2.0,
      sleepHoursPerNight: 9.5, // ~66.5 hrs/week
      studyHours: 4.0,
      maxGuiltFreeLeisureHours: 14.0,
      maxUnnoticedHoursPerWeek: 8.0,
    },
  },
  12: {
    age: 12,
    weeklyTargets: {
      tennisTotalHours: 16.0,
      tennisFocusRatio: 0.7,
      multisportHours: 6.0, // Drop parkour/TKD, keep gymnastics/S&C
      mobilityHours: 3.5,
      tennisIqHours: 2.5,
      sleepHoursPerNight: 9.5,
      studyHours: 5.0,
      maxGuiltFreeLeisureHours: 12.0,
      maxUnnoticedHoursPerWeek: 6.0,
    },
  },
  13: {
    age: 13,
    weeklyTargets: {
      tennisTotalHours: 19.0,
      tennisFocusRatio: 0.8,
      multisportHours: 3.0, // Tennis-specific S&C only
      mobilityHours: 4.0,
      tennisIqHours: 3.0,
      sleepHoursPerNight: 9.25,
      studyHours: 6.0,
      maxGuiltFreeLeisureHours: 10.0,
      maxUnnoticedHoursPerWeek: 5.0,
    },
  },
};

export function getBenchmarkForAge(age: number): AgeIdealBenchmark {
  if (AGE_BENCHMARKS[age]) return AGE_BENCHMARKS[age];
  if (age < 10) return AGE_BENCHMARKS[10];
  return AGE_BENCHMARKS[13];
}

// Generate the initial Autumn 2026 weekly template (default activities start uncompleted until user checks them)
export function createAutumn2026Term(): TermSchedule {
  // Kid 1 (11yo) Monday to Sunday schedules
  const kid1Monday: ActivityBlock[] = [
    { id: 'k1-mon-sleep-prev', category: 'sleep', title: 'Night Sleep (Cont. from Sun)', startTime: '00:00', endTime: '06:00', durationHours: 6.0, completed: false },
    { id: 'k1-mon-morning-routine', category: 'guilt_free_fun', title: 'Wake up & Breakfast', startTime: '06:00', endTime: '06:45', durationHours: 0.75, completed: false },
    { id: 'k1-mon-tennis-morn', category: 'tennis_focus', title: 'Morning Tennis (Serves & Drills)', startTime: '06:45', endTime: '08:00', durationHours: 1.25, completed: false },
    { id: 'k1-mon-prep', category: 'guilt_free_fun', title: 'Shower & School Prep', startTime: '08:00', endTime: '08:45', durationHours: 0.75, completed: false },
    { id: 'k1-mon-trans-school', category: 'transit', title: 'Drive to School', startTime: '08:45', endTime: '09:10', durationHours: 0.42, completed: false },
    { id: 'k1-mon-school', category: 'school', title: 'School', startTime: '09:10', endTime: '15:05', durationHours: 5.92, completed: false },
    { id: 'k1-mon-trans-home', category: 'transit', title: 'Drive Home', startTime: '15:05', endTime: '15:30', durationHours: 0.42, completed: false },
    { id: 'k1-mon-snack-relax', category: 'guilt_free_fun', title: 'Guilt-Free Snack & Chill', startTime: '15:30', endTime: '16:15', durationHours: 0.75, completed: false },
    { id: 'k1-mon-trans-gym', category: 'transit', title: 'Drive to Gymnastics', startTime: '16:15', endTime: '17:00', durationHours: 0.75, completed: false },
    { id: 'k1-mon-gym', category: 'multisport', title: 'Gymnastics (Group)', startTime: '17:00', endTime: '19:30', durationHours: 2.5, completed: false },
    { id: 'k1-mon-trans-gym-home', category: 'transit', title: 'Drive Home + Snack', startTime: '19:30', endTime: '20:30', durationHours: 1.0, completed: false },
    { id: 'k1-mon-dinner', category: 'guilt_free_fun', title: 'Dinner with Family', startTime: '20:30', endTime: '21:00', durationHours: 0.5, completed: false },
    { id: 'k1-mon-prehab', category: 'mobility_prehab', title: 'Foam Roll & Pre-bed Stretch', startTime: '21:00', endTime: '21:30', durationHours: 0.5, completed: false },
    { id: 'k1-mon-sleep-night', category: 'sleep', title: 'Night Sleep', startTime: '21:30', endTime: '24:00', durationHours: 2.5, completed: false },
  ];

  const kid1Tuesday: ActivityBlock[] = [
    { id: 'k1-tue-sleep-prev', category: 'sleep', title: 'Night Sleep (Cont. from Mon)', startTime: '00:00', endTime: '06:45', durationHours: 6.75, completed: false },
    { id: 'k1-tue-morn', category: 'guilt_free_fun', title: 'Wake up, Breakfast & Ready', startTime: '06:45', endTime: '08:00', durationHours: 1.25, completed: false },
    { id: 'k1-tue-trans-school', category: 'transit', title: 'Drive to School', startTime: '08:00', endTime: '08:30', durationHours: 0.5, completed: false },
    { id: 'k1-tue-school', category: 'school', title: 'School', startTime: '08:30', endTime: '15:05', durationHours: 6.58, completed: false },
    { id: 'k1-tue-trans-tennis', category: 'transit', title: 'Drive to Tennis + Snack in Car', startTime: '15:15', endTime: '16:00', durationHours: 0.75, completed: false },
    { id: 'k1-tue-tennis', category: 'tennis_squad', title: 'Tennis Club (1:4 Squad)', startTime: '16:00', endTime: '17:00', durationHours: 1.0, completed: false },
    { id: 'k1-tue-cooldown', category: 'mobility_prehab', title: 'Dynamic Cool-down & Hydrate', startTime: '17:00', endTime: '17:15', durationHours: 0.25, completed: false },
    { id: 'k1-tue-trans-tkd', category: 'transit', title: 'Drive to Taekwondo', startTime: '17:15', endTime: '18:00', durationHours: 0.75, completed: false },
    { id: 'k1-tue-tkd', category: 'multisport', title: 'Taekwondo', startTime: '18:00', endTime: '20:10', durationHours: 2.17, completed: false },
    { id: 'k1-tue-trans-home', category: 'transit', title: 'Drive Home', startTime: '20:10', endTime: '20:40', durationHours: 0.5, completed: false },
    { id: 'k1-tue-dinner-fun', category: 'guilt_free_fun', title: 'Dinner & Chill / Gadget', startTime: '20:40', endTime: '21:30', durationHours: 0.83, completed: false },
    { id: 'k1-tue-sleep-night', category: 'sleep', title: 'Night Sleep', startTime: '21:30', endTime: '24:00', durationHours: 2.5, completed: false },
  ];

  const kid1Wednesday: ActivityBlock[] = [
    { id: 'k1-wed-sleep-prev', category: 'sleep', title: 'Night Sleep (Cont. from Tue)', startTime: '00:00', endTime: '06:00', durationHours: 6.0, completed: false },
    { id: 'k1-wed-morn-routine', category: 'guilt_free_fun', title: 'Wake up + Breakfast', startTime: '06:00', endTime: '06:45', durationHours: 0.75, completed: false },
    { id: 'k1-wed-tennis-morn', category: 'tennis_focus', title: 'Morning Tennis (Volleys & Targets)', startTime: '06:45', endTime: '08:00', durationHours: 1.25, completed: false },
    { id: 'k1-wed-trans-school', category: 'transit', title: 'Drive to School', startTime: '08:00', endTime: '08:30', durationHours: 0.5, completed: false },
    { id: 'k1-wed-school', category: 'school', title: 'School', startTime: '08:30', endTime: '15:05', durationHours: 6.58, completed: false },
    { id: 'k1-wed-trans-home', category: 'transit', title: 'Drive Home', startTime: '15:05', endTime: '15:30', durationHours: 0.42, completed: false },
    { id: 'k1-wed-chill', category: 'guilt_free_fun', title: 'Guilt-Free Snack & Relax', startTime: '15:30', endTime: '16:15', durationHours: 0.75, completed: false },
    { id: 'k1-wed-trans-gym', category: 'transit', title: 'Drive to Gymnastics', startTime: '16:15', endTime: '17:00', durationHours: 0.75, completed: false },
    { id: 'k1-wed-gym', category: 'multisport', title: 'Gymnastics (Group)', startTime: '17:00', endTime: '19:30', durationHours: 2.5, completed: false },
    { id: 'k1-wed-trans-gym-home', category: 'transit', title: 'Drive Home', startTime: '19:30', endTime: '20:30', durationHours: 1.0, completed: false },
    { id: 'k1-wed-dinner', category: 'guilt_free_fun', title: 'Dinner', startTime: '20:30', endTime: '21:00', durationHours: 0.5, completed: false },
    { id: 'k1-wed-prehab', category: 'mobility_prehab', title: 'Shoulder Band Rotations & Core', startTime: '21:00', endTime: '21:30', durationHours: 0.5, completed: false },
    { id: 'k1-wed-sleep-night', category: 'sleep', title: 'Night Sleep', startTime: '21:30', endTime: '24:00', durationHours: 2.5, completed: false },
  ];

  const kid1Thursday: ActivityBlock[] = [
    { id: 'k1-thu-sleep-prev', category: 'sleep', title: 'Night Sleep (Cont. from Wed)', startTime: '00:00', endTime: '07:00', durationHours: 7.0, completed: false },
    { id: 'k1-thu-morn', category: 'guilt_free_fun', title: 'Wake up, Breakfast & Ready', startTime: '07:00', endTime: '08:00', durationHours: 1.0, completed: false },
    { id: 'k1-thu-trans-school', category: 'transit', title: 'Drive to School', startTime: '08:00', endTime: '08:30', durationHours: 0.5, completed: false },
    { id: 'k1-thu-school', category: 'school', title: 'School', startTime: '08:30', endTime: '15:05', durationHours: 6.58, completed: false },
    { id: 'k1-thu-trans-tennis', category: 'transit', title: 'Drive to Tennis', startTime: '15:15', endTime: '16:00', durationHours: 0.75, completed: false },
    { id: 'k1-thu-tennis-club', category: 'tennis_squad', title: 'Tennis Club (1:4 Squad)', startTime: '16:00', endTime: '17:00', durationHours: 1.0, completed: false },
    { id: 'k1-thu-tennis-dad', category: 'tennis_focus', title: '1:1 High-Rep Drills with Dad / Wall', startTime: '17:00', endTime: '18:00', durationHours: 1.0, completed: false },
    { id: 'k1-thu-trans-home', category: 'transit', title: 'Drive Home & Snack', startTime: '18:00', endTime: '18:45', durationHours: 0.75, completed: false },
    { id: 'k1-thu-gaming', category: 'guilt_free_fun', title: 'Guilt-Free PlayStation / Yapping', startTime: '18:45', endTime: '19:45', durationHours: 1.0, completed: false },
    { id: 'k1-thu-dinner', category: 'guilt_free_fun', title: 'Dinner', startTime: '19:45', endTime: '20:30', durationHours: 0.75, completed: false },
    { id: 'k1-thu-video', category: 'tennis_iq', title: 'Pro Match Tactical Analysis', startTime: '20:30', endTime: '21:15', durationHours: 0.75, completed: false },
    { id: 'k1-thu-sleep-night', category: 'sleep', title: 'Night Sleep', startTime: '21:15', endTime: '24:00', durationHours: 2.75, completed: false },
  ];

  const kid1Friday: ActivityBlock[] = [
    { id: 'k1-fri-sleep-prev', category: 'sleep', title: 'Night Sleep (Cont. from Thu)', startTime: '00:00', endTime: '06:00', durationHours: 6.0, completed: false },
    { id: 'k1-fri-morn-routine', category: 'guilt_free_fun', title: 'Wake up + Breakfast', startTime: '06:00', endTime: '06:45', durationHours: 0.75, completed: false },
    { id: 'k1-fri-tennis-morn', category: 'tennis_focus', title: 'Morning Tennis (Serve Targets)', startTime: '06:45', endTime: '08:00', durationHours: 1.25, completed: false },
    { id: 'k1-fri-trans-school', category: 'transit', title: 'Drive to School', startTime: '08:00', endTime: '08:30', durationHours: 0.5, completed: false },
    { id: 'k1-fri-school', category: 'school', title: 'School (Finishes 14:20 for Elder)', startTime: '08:30', endTime: '14:20', durationHours: 5.83, completed: false },
    { id: 'k1-fri-wait-brother', category: 'guilt_free_fun', title: 'School Yard Play / Chill with Friends', startTime: '14:20', endTime: '15:05', durationHours: 0.75, completed: false },
    { id: 'k1-fri-trans-tennis', category: 'transit', title: 'Drive to Tennis', startTime: '15:05', endTime: '15:30', durationHours: 0.42, completed: false },
    { id: 'k1-fri-tennis-squad', category: 'tennis_squad', title: 'Tennis Club (2h Squad)', startTime: '15:30', endTime: '17:30', durationHours: 2.0, completed: false },
    { id: 'k1-fri-trans-parkour', category: 'transit', title: 'Drive to Parkour', startTime: '17:30', endTime: '18:00', durationHours: 0.5, completed: false },
    { id: 'k1-fri-parkour', category: 'multisport', title: 'Parkour', startTime: '18:00', endTime: '19:30', durationHours: 1.5, completed: false },
    { id: 'k1-fri-trans-home', category: 'transit', title: 'Drive Home', startTime: '19:30', endTime: '20:15', durationHours: 0.75, completed: false },
    { id: 'k1-fri-movie-night', category: 'guilt_free_fun', title: 'Dinner & Friday Movie / Gaming Night', startTime: '20:15', endTime: '21:45', durationHours: 1.5, completed: false },
    { id: 'k1-fri-sleep-night', category: 'sleep', title: 'Night Sleep', startTime: '21:45', endTime: '24:00', durationHours: 2.25, completed: false },
  ];

  const kid1Saturday: ActivityBlock[] = [
    { id: 'k1-sat-sleep-prev', category: 'sleep', title: 'Night Sleep (Cont. from Fri)', startTime: '00:00', endTime: '07:30', durationHours: 7.5, completed: false },
    { id: 'k1-sat-breakfast', category: 'guilt_free_fun', title: 'Wake up, Big Breakfast', startTime: '07:30', endTime: '08:30', durationHours: 1.0, completed: false },
    { id: 'k1-sat-tennis-match', category: 'tennis_focus', title: 'Tennis Training (Match Sim / Points with Dad)', startTime: '08:30', endTime: '10:30', durationHours: 2.0, completed: false },
    { id: 'k1-sat-trans-tkd', category: 'transit', title: 'Drive to Taekwondo', startTime: '10:30', endTime: '11:00', durationHours: 0.5, completed: false },
    { id: 'k1-sat-tkd', category: 'multisport', title: 'Taekwondo', startTime: '11:00', endTime: '12:00', durationHours: 1.0, completed: false },
    { id: 'k1-sat-lunch', category: 'guilt_free_fun', title: 'Drive Home & Lunch', startTime: '12:00', endTime: '13:00', durationHours: 1.0, completed: false },
    { id: 'k1-sat-homework', category: 'study_homework', title: 'Weekly School Homework', startTime: '13:00', endTime: '14:00', durationHours: 1.0, completed: false },
    { id: 'k1-sat-play', category: 'guilt_free_fun', title: 'Guilt-Free PlayStation / Friends / Free Play', startTime: '14:00', endTime: '17:30', durationHours: 3.5, completed: false },
    { id: 'k1-sat-outing', category: 'guilt_free_fun', title: 'Family Free Outing / Outdoor Play', startTime: '17:30', endTime: '19:30', durationHours: 2.0, completed: false },
    { id: 'k1-sat-dinner', category: 'guilt_free_fun', title: 'Dinner & Family Time', startTime: '19:30', endTime: '20:30', durationHours: 1.0, completed: false },
    { id: 'k1-sat-prehab', category: 'mobility_prehab', title: 'Full Body Foam Roll & Stretch', startTime: '20:30', endTime: '21:30', durationHours: 1.0, completed: false },
    { id: 'k1-sat-sleep-night', category: 'sleep', title: 'Night Sleep', startTime: '21:30', endTime: '24:00', durationHours: 2.5, completed: false },
  ];

  const kid1Sunday: ActivityBlock[] = [
    { id: 'k1-sun-sleep-prev', category: 'sleep', title: 'Night Sleep (Cont. from Sat)', startTime: '00:00', endTime: '07:30', durationHours: 7.5, completed: false },
    { id: 'k1-sun-breakfast', category: 'guilt_free_fun', title: 'Wake up & Nutritious Breakfast', startTime: '07:30', endTime: '08:30', durationHours: 1.0, completed: false },
    { id: 'k1-sun-tennis-serves', category: 'tennis_focus', title: 'Tennis Serve Volume (150 Serves) & Drill', startTime: '08:30', endTime: '10:30', durationHours: 2.0, completed: false },
    { id: 'k1-sun-play1', category: 'guilt_free_fun', title: 'Guilt-Free Play / Gaming', startTime: '10:30', endTime: '12:30', durationHours: 2.0, completed: false },
    { id: 'k1-sun-lunch', category: 'guilt_free_fun', title: 'Lunch with Family', startTime: '12:30', endTime: '13:30', durationHours: 1.0, completed: false },
    { id: 'k1-sun-outing', category: 'guilt_free_fun', title: 'Outdoor Active Outing / Bike / Rest', startTime: '13:30', endTime: '16:30', durationHours: 3.0, completed: false },
    { id: 'k1-sun-prep', category: 'study_homework', title: 'School Bag Prep & Next Week Review', startTime: '16:30', endTime: '17:30', durationHours: 1.0, completed: false },
    { id: 'k1-sun-trans-parkour', category: 'transit', title: 'Drive to Parkour', startTime: '17:30', endTime: '18:00', durationHours: 0.5, completed: false },
    { id: 'k1-sun-parkour', category: 'multisport', title: 'Parkour', startTime: '18:00', endTime: '19:30', durationHours: 1.5, completed: false },
    { id: 'k1-sun-dinner', category: 'guilt_free_fun', title: 'Drive Home & Dinner', startTime: '19:30', endTime: '20:30', durationHours: 1.0, completed: false },
    { id: 'k1-sun-prehab', category: 'mobility_prehab', title: 'Mobility & Pre-bed Foam Roll', startTime: '20:30', endTime: '21:15', durationHours: 0.75, completed: false },
    { id: 'k1-sun-sleep-night', category: 'sleep', title: 'Night Sleep', startTime: '21:15', endTime: '24:00', durationHours: 2.75, completed: false },
  ];

  // Kid 2 (10yo) schedules:
  // Same as Kid 1 with specific differences:
  // - Tuesday: School ends 14:20 (waits in library/reads 14:20 to 15:05)
  // - Friday: School ends 15:05 (Elder ends 14:20)
  const kid2Tuesday = kid1Tuesday.map(b => {
    if (b.id === 'k1-tue-school') {
      return { ...b, id: 'k2-tue-school', title: 'School (Finishes 14:20 for Younger)', endTime: '14:20', durationHours: 5.83 };
    }
    return { ...b, id: b.id.replace('k1-', 'k2-') };
  });
  // insert 14:20-15:05 library study
  kid2Tuesday.splice(4, 0, {
    id: 'k2-tue-library-wait',
    category: 'study_homework',
    title: 'School Library: Reading / Homework Done!',
    startTime: '14:20',
    endTime: '15:05',
    durationHours: 0.75,
    completed: true,
  });

  const kid2Friday = kid1Friday.map(b => {
    if (b.id === 'k1-fri-school') {
      return { ...b, id: 'k2-fri-school', title: 'School (Full day till 15:05)', endTime: '15:05', durationHours: 6.58 };
    }
    if (b.id === 'k1-fri-wait-brother') {
      return null; // Kid 2 doesn't wait on Friday
    }
    return { ...b, id: b.id.replace('k1-', 'k2-') };
  }).filter(Boolean) as ActivityBlock[];

  return {
    id: 'autumn-2026',
    name: 'Autumn Term 2026 (Aug - Dec)',
    startDate: '2026-08-15',
    endDate: '2026-12-31',
    isCurrent: true,
    weeklyDefaults: {
      kid1: {
        monday: kid1Monday,
        tuesday: kid1Tuesday,
        wednesday: kid1Wednesday,
        thursday: kid1Thursday,
        friday: kid1Friday,
        saturday: kid1Saturday,
        sunday: kid1Sunday,
      },
      kid2: {
        monday: kid1Monday.map(b => ({ ...b, id: b.id.replace('k1-', 'k2-') })),
        tuesday: kid2Tuesday,
        wednesday: kid1Wednesday.map(b => ({ ...b, id: b.id.replace('k1-', 'k2-') })),
        thursday: kid1Thursday.map(b => ({ ...b, id: b.id.replace('k1-', 'k2-') })),
        friday: kid2Friday,
        saturday: kid1Saturday.map(b => ({ ...b, id: b.id.replace('k1-', 'k2-') })),
        sunday: kid1Sunday.map(b => ({ ...b, id: b.id.replace('k1-', 'k2-') })),
      },
    },
  };
}

/**
 * Dynamic Ideal Pro Target Engine for a specific day
 * Takes date, child age, day log flags (holiday, sick, match day, cancelled activities)
 * and calculates the exact ideal target hours for that day!
 */
export interface CalculatedIdealDay {
  tennisHours: number;
  multisportHours: number;
  mobilityHours: number;
  sleepHours: number;
  studyHours: number;
  transitHours: number;
  schoolHours: number;
  guiltFreeFunHours: number;
  effectiveScoreTarget: number;
  statusNote: string;
}

export function calculateIdealForDay(
  dayOfWeek: DayOfWeek,
  age: number,
  flags: {
    isSick?: boolean;
    isSchoolHoliday?: boolean;
    isMatchDay?: boolean;
    hasCancelledGymnastics?: boolean;
    hasCancelledTennis?: boolean;
    hasCancelledParkour?: boolean;
    hasCancelledTKD?: boolean;
  }
): CalculatedIdealDay {
  const benchmark = getBenchmarkForAge(age);
  const isWeekend = dayOfWeek === 'saturday' || dayOfWeek === 'sunday';

  // SICK DAY HANDLING:
  if (flags.isSick) {
    return {
      tennisHours: 0,
      multisportHours: 0,
      mobilityHours: 0,
      sleepHours: 12.0, // Extra recovery sleep
      studyHours: 0.5,
      transitHours: 0,
      schoolHours: 0,
      guiltFreeFunHours: 11.5, // Rest and quiet recovery
      effectiveScoreTarget: 0, // Pauses score growth without penalty
      statusNote: '🤒 Sick Day Mode: Training target paused, recovery prioritized',
    };
  }

  // MATCH DAY HANDLING (Weekend or Tournament):
  if (flags.isMatchDay) {
    const sleep = benchmark.weeklyTargets.sleepHoursPerNight;
    const tennis = 3.5; // Match warmup, match, cooldown
    const mobility = 0.75; // Foam rolling & prehab
    const transit = 1.5;
    const study = isWeekend ? 1.0 : 0.5;
    const fun = Math.max(0, 24 - (sleep + tennis + mobility + transit + study));
    return {
      tennisHours: tennis,
      multisportHours: 0,
      mobilityHours: mobility,
      sleepHours: sleep,
      studyHours: study,
      transitHours: transit,
      schoolHours: 0,
      guiltFreeFunHours: fun,
      effectiveScoreTarget: tennis * 1.0 + mobility * 0.5,
      statusNote: '🏆 Match Day: Full intensity match load applied',
    };
  }

  // SCHOOL HOLIDAY HANDLING (Weekday with no school):
  if (flags.isSchoolHoliday && !isWeekend) {
    const sleep = 10.0;
    const tennis = 2.5; // +1h morning session + regular
    const multisport = 2.0;
    const mobility = 0.5;
    const transit = 1.0;
    const study = 1.0;
    const fun = Math.max(0, 24 - (sleep + tennis + multisport + mobility + transit + study));
    return {
      tennisHours: tennis,
      multisportHours: multisport,
      mobilityHours: mobility,
      sleepHours: sleep,
      studyHours: study,
      transitHours: transit,
      schoolHours: 0,
      guiltFreeFunHours: fun,
      effectiveScoreTarget: tennis * 0.8 + multisport * 0.4 + mobility * 0.5,
      statusNote: '🏖 School Holiday: Replaced school with extra court time and guilt-free fun',
    };
  }

  // STANDARD DAY (WITH DYNAMIC CANCELLATION REDISTRIBUTION):
  let tennis = 0;
  let multisport = 0;
  let mobility = 0.5;
  let school = isWeekend ? 0 : 6.0;
  let transit = isWeekend ? 1.0 : 2.0;
  let study = isWeekend ? 1.0 : 0.5;
  let sleep = benchmark.weeklyTargets.sleepHoursPerNight;

  if (dayOfWeek === 'monday' || dayOfWeek === 'wednesday') {
    tennis = 1.25; // Morning session
    multisport = flags.hasCancelledGymnastics ? 0 : 2.5; // Gymnastics
    if (flags.hasCancelledGymnastics) {
      // 45m home core/agility converted
      mobility += 0.75;
      transit -= 1.0;
    }
  } else if (dayOfWeek === 'tuesday') {
    tennis = flags.hasCancelledTennis ? 0 : 1.0; // Club squad
    multisport = flags.hasCancelledTKD ? 0 : 2.17; // Taekwondo
  } else if (dayOfWeek === 'thursday') {
    tennis = 2.0; // 1h club squad + 1h 1:1 Dad session
    multisport = 0;
  } else if (dayOfWeek === 'friday') {
    tennis = 3.25; // 1.25 morning + 2.0 squad
    multisport = flags.hasCancelledParkour ? 0 : 1.5;
  } else if (dayOfWeek === 'saturday') {
    tennis = 2.0; // Point play / match sim
    multisport = 1.0; // TKD
  } else if (dayOfWeek === 'sunday') {
    tennis = 2.0; // Serve volume + drills
    multisport = flags.hasCancelledParkour ? 0 : 1.5;
  }

  const allocated = tennis + multisport + mobility + school + transit + study + sleep;
  const fun = Math.max(0, parseFloat((24.0 - allocated).toFixed(2)));

  const effectiveScore = tennis * 0.8 + multisport * 0.4 + mobility * 0.5;

  return {
    tennisHours: tennis,
    multisportHours: multisport,
    mobilityHours: mobility,
    sleepHours: sleep,
    studyHours: study,
    transitHours: transit,
    schoolHours: school,
    guiltFreeFunHours: fun,
    effectiveScoreTarget: parseFloat(effectiveScore.toFixed(2)),
    statusNote: 'Standard Dynamic Ideal Pro Day',
  };
}
