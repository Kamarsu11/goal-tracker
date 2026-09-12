import React, { useState } from 'react';
import { AGE_BENCHMARKS } from '../../utils/defaultSchedules';
import { CATEGORY_DEFINITIONS } from '../../utils/categories';
import { Target, BookOpen, Award, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export const BenchmarkSettingsTab: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState<number>(11);

  const benchmark = AGE_BENCHMARKS[selectedAge] || AGE_BENCHMARKS[11];

  const ages = [10, 11, 12, 13, 14, 15, 16];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-tennis-500/20 text-tennis-400 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Future Tennis Pro Development Benchmarks
            </h3>
            <p className="text-xs text-slate-400">
              Grounded in European Pro Development Frameworks (Alcaraz, Sinner, Ferrero Equelite & USTA LTAD)
            </p>
          </div>
        </div>
      </div>

      {/* Age Milestone Selector */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Age Milestone:
          </span>
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {ages.map(age => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedAge === age
                    ? 'bg-tennis-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Age {age}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Age Target Dashboard */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-tennis-400" />
              <span className="text-sm font-bold text-slate-100">
                Age {selectedAge} Target Athletic Load:
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-tennis-400 font-bold bg-tennis-500/10 border border-tennis-500/30 px-2.5 py-1 rounded-lg">
                🏆 Weekly Target: {benchmark.weeklyTargets.weeklyScoreTarget.toFixed(2)} pts/week
              </span>
              <span className="text-sky-400 font-bold bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-lg">
                ⚡ Daily Rate: {benchmark.weeklyTargets.dailyScoreTarget.toFixed(2)} pts/day
              </span>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">High-Int Tennis (1.0x)</div>
              <div className="text-sm font-bold text-lime-400 mt-0.5">
                {benchmark.weeklyTargets.highIntensityTennisHours} hrs/wk
              </div>
              <div className="text-[10px] text-slate-500">
                +{(benchmark.weeklyTargets.highIntensityTennisHours * 1.0).toFixed(2)} pts
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Practice Matches (0.8x)</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">
                {benchmark.weeklyTargets.practiceMatchHours} hrs/wk
              </div>
              <div className="text-[10px] text-slate-500">
                +{(benchmark.weeklyTargets.practiceMatchHours * 0.8).toFixed(2)} pts
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Squad Practice (0.6x)</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {benchmark.weeklyTargets.squadPracticeHours} hrs/wk
              </div>
              <div className="text-[10px] text-slate-500">
                +{(benchmark.weeklyTargets.squadPracticeHours * 0.6).toFixed(2)} pts
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Multisport (0.7x)</div>
              <div className="text-sm font-bold text-indigo-400 mt-0.5">
                {benchmark.weeklyTargets.multisportHours} hrs/wk
              </div>
              <div className="text-[10px] text-slate-500">
                +{(benchmark.weeklyTargets.multisportHours * 0.7).toFixed(2)} pts
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">S&C & Footwork (0.6x)</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">
                {benchmark.weeklyTargets.scFootworkHours} hrs/wk
              </div>
              <div className="text-[10px] text-slate-500">
                +{(benchmark.weeklyTargets.scFootworkHours * 0.6).toFixed(2)} pts
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Pre-hab & Injury (0.5x)</div>
              <div className="text-sm font-bold text-pink-400 mt-0.5">
                {benchmark.weeklyTargets.prehabHours} hrs/wk
              </div>
              <div className="text-[10px] text-slate-500">
                +{(benchmark.weeklyTargets.prehabHours * 0.5).toFixed(2)} pts
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Intentional Rest (0.5x)</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">
                {benchmark.weeklyTargets.intentionalRestHours} hrs/wk
              </div>
              <div className="text-[10px] text-slate-500">
                +{(benchmark.weeklyTargets.intentionalRestHours * 0.5).toFixed(2)} pts
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Tennis IQ & Video (0.5x)</div>
              <div className="text-sm font-bold text-sky-400 mt-0.5">
                {benchmark.weeklyTargets.tennisIqHours} hrs/wk
              </div>
              <div className="text-[10px] text-slate-500">
                +{(benchmark.weeklyTargets.tennisIqHours * 0.5).toFixed(2)} pts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* European Pro Development Reference Tables */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              How the Pro Weekly Benchmark is Derived (European Academy & Schooling Matrix)
            </h4>
            <p className="text-xs text-slate-400">
              Pathway A (Standard School + Club) vs. Pathway B (Full-Time Academy)
            </p>
          </div>
        </div>

        {/* Pathway A Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-lime-400">
            Pathway A: Standard Schooling + High-Performance Club (Alcaraz, Sinner Stage, Ages 10–13)
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                  <th className="p-2.5 font-bold">Age</th>
                  <th className="p-2.5">High-Int Tennis (1.0x)</th>
                  <th className="p-2.5">Match Play (0.8x)</th>
                  <th className="p-2.5">Squad (0.6x)</th>
                  <th className="p-2.5">Multisport (0.7x)</th>
                  <th className="p-2.5">S&C / Footwork (0.6x)</th>
                  <th className="p-2.5">Prehab / Rest / IQ (0.5x)</th>
                  <th className="p-2.5 font-bold text-tennis-400">Weekly Score</th>
                  <th className="p-2.5 font-bold text-sky-400">Daily Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className={selectedAge === 10 ? 'bg-tennis-500/10 font-semibold text-slate-100' : ''}>
                  <td className="p-2.5 font-bold text-slate-200">Age 10 (Younger)</td>
                  <td className="p-2.5">3.5h (3.50)</td>
                  <td className="p-2.5">2.0h (1.60)</td>
                  <td className="p-2.5">5.0h (3.00)</td>
                  <td className="p-2.5">8.0h (5.60)</td>
                  <td className="p-2.5">1.5h (0.90)</td>
                  <td className="p-2.5">6.0h (3.00)</td>
                  <td className="p-2.5 font-bold text-tennis-400">17.60 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">2.51 pts/d</td>
                </tr>
                <tr className={selectedAge === 11 ? 'bg-tennis-500/10 font-semibold text-slate-100' : ''}>
                  <td className="p-2.5 font-bold text-slate-200">Age 11 (Elder)</td>
                  <td className="p-2.5">4.5h (4.50)</td>
                  <td className="p-2.5">2.5h (2.00)</td>
                  <td className="p-2.5">5.0h (3.00)</td>
                  <td className="p-2.5">7.5h (5.25)</td>
                  <td className="p-2.5">2.0h (1.20)</td>
                  <td className="p-2.5">7.0h (3.50)</td>
                  <td className="p-2.5 font-bold text-tennis-400">19.45 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">2.78 pts/d</td>
                </tr>
                <tr className={selectedAge === 12 ? 'bg-tennis-500/10 font-semibold text-slate-100' : ''}>
                  <td className="p-2.5 font-bold text-slate-200">Age 12</td>
                  <td className="p-2.5">6.0h (6.00)</td>
                  <td className="p-2.5">3.0h (2.40)</td>
                  <td className="p-2.5">5.0h (3.00)</td>
                  <td className="p-2.5">5.0h (3.50)</td>
                  <td className="p-2.5">3.0h (1.80)</td>
                  <td className="p-2.5">8.5h (4.25)</td>
                  <td className="p-2.5 font-bold text-tennis-400">20.95 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">2.99 pts/d</td>
                </tr>
                <tr className={selectedAge === 13 ? 'bg-tennis-500/10 font-semibold text-slate-100' : ''}>
                  <td className="p-2.5 font-bold text-slate-200">Age 13</td>
                  <td className="p-2.5">8.0h (8.00)</td>
                  <td className="p-2.5">4.0h (3.20)</td>
                  <td className="p-2.5">4.0h (2.40)</td>
                  <td className="p-2.5">2.5h (1.75)</td>
                  <td className="p-2.5">4.5h (2.70)</td>
                  <td className="p-2.5">9.5h (4.75)</td>
                  <td className="p-2.5 font-bold text-tennis-400">22.80 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">3.26 pts/d</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pathway B Table */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-cyan-400">
            Pathway B: Full-Time Pro Academy / Distance School (Mouratoglou, Rafa Nadal Academy, Ages 12–16)
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                  <th className="p-2.5 font-bold">Age</th>
                  <th className="p-2.5">High-Int Tennis (1.0x)</th>
                  <th className="p-2.5">Match Play (0.8x)</th>
                  <th className="p-2.5">Squad (0.6x)</th>
                  <th className="p-2.5">S&C / Footwork (0.6x)</th>
                  <th className="p-2.5">Prehab / Rest / IQ (0.5x)</th>
                  <th className="p-2.5 font-bold text-tennis-400">Weekly Score</th>
                  <th className="p-2.5 font-bold text-sky-400">Daily Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-2.5 font-bold text-slate-200">Age 12</td>
                  <td className="p-2.5">8.0h (8.00)</td>
                  <td className="p-2.5">3.0h (2.40)</td>
                  <td className="p-2.5">5.0h (3.00)</td>
                  <td className="p-2.5">4.0h (2.40)</td>
                  <td className="p-2.5">10.0h (5.00)</td>
                  <td className="p-2.5 font-bold text-tennis-400">22.20 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">3.17 pts/d</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-200">Age 13</td>
                  <td className="p-2.5">10.0h (10.00)</td>
                  <td className="p-2.5">4.0h (3.20)</td>
                  <td className="p-2.5">4.0h (2.40)</td>
                  <td className="p-2.5">6.0h (3.60)</td>
                  <td className="p-2.5">11.5h (5.75)</td>
                  <td className="p-2.5 font-bold text-tennis-400">24.95 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">3.56 pts/d</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-200">Age 14</td>
                  <td className="p-2.5">12.0h (12.00)</td>
                  <td className="p-2.5">4.0h (3.20)</td>
                  <td className="p-2.5">3.0h (1.80)</td>
                  <td className="p-2.5">7.0h (4.20)</td>
                  <td className="p-2.5">12.5h (6.25)</td>
                  <td className="p-2.5 font-bold text-tennis-400">27.45 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">3.92 pts/d</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-200">Age 15</td>
                  <td className="p-2.5">14.0h (14.00)</td>
                  <td className="p-2.5">4.0h (3.20)</td>
                  <td className="p-2.5">3.0h (1.80)</td>
                  <td className="p-2.5">8.0h (4.80)</td>
                  <td className="p-2.5">13.5h (6.75)</td>
                  <td className="p-2.5 font-bold text-tennis-400">30.55 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">4.36 pts/d</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-200">Age 16</td>
                  <td className="p-2.5">16.0h (16.00)</td>
                  <td className="p-2.5">4.0h (3.20)</td>
                  <td className="p-2.5">2.0h (1.20)</td>
                  <td className="p-2.5">9.0h (5.40)</td>
                  <td className="p-2.5">14.0h (7.00)</td>
                  <td className="p-2.5 font-bold text-tennis-400">33.05 pts</td>
                  <td className="p-2.5 font-bold text-sky-400">4.72 pts/d</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
