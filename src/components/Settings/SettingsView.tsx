import React, { useState, useEffect } from 'react';
import { ChildProfile, TermSchedule } from '../../types';
import { DataService } from '../../services/dataService';
import { DefaultScheduleEditor } from './DefaultScheduleEditor';
import { DataBackupRestore } from './DataBackupRestore';
import { ChildProfileEditor } from './ChildProfileEditor';
import { BenchmarkSettingsTab } from './BenchmarkSettingsTab';
import { Settings, Calendar, User, Database, Target } from 'lucide-react';

interface SettingsViewProps {
  onDataChanged: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onDataChanged }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'profiles' | 'benchmarks' | 'data'>('schedule');
  const [term, setTerm] = useState<TermSchedule | null>(null);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const loadedTerm = await DataService.getCurrentTerm();
    const loadedProfiles = await DataService.getProfiles();
    if (loadedTerm) setTerm(loadedTerm);
    setProfiles(loadedProfiles);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTerm = async (updatedTerm: TermSchedule) => {
    await DataService.saveTerm(updatedTerm);
    setTerm(updatedTerm);
    onDataChanged();
  };

  const handleSaveProfile = async (profile: ChildProfile) => {
    await DataService.updateProfile(profile);
    setProfiles(prev => prev.map(p => (p.id === profile.id ? profile : p)));
    onDataChanged();
  };

  if (loading || !term) {
    return <div className="p-12 text-center text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-brand-card border border-brand-border rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 min-w-[105px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'schedule'
              ? 'bg-tennis-500 text-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Weekly Defaults</span>
        </button>

        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex-1 min-w-[95px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profiles'
              ? 'bg-tennis-500 text-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Kid Profiles</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'benchmarks'
              ? 'bg-tennis-500 text-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Pro Benchmarks</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 min-w-[95px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'data'
              ? 'bg-tennis-500 text-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & CSV</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'schedule' && (
        <DefaultScheduleEditor
          term={term}
          profiles={profiles}
          onSaveTerm={handleSaveTerm}
        />
      )}

      {activeTab === 'profiles' && (
        <ChildProfileEditor
          profiles={profiles}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {activeTab === 'benchmarks' && (
        <BenchmarkSettingsTab />
      )}

      {activeTab === 'data' && (
        <DataBackupRestore
          onDataChanged={() => {
            loadData();
            onDataChanged();
          }}
        />
      )}

      {/* Quality Weights & Scoring Reference Card */}
      <div className="bg-brand-card/90 border border-brand-border rounded-2xl p-4 shadow-xl space-y-3">
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
          <span>⚖️ Activity Quality Weights & Scoring Reference</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-lime-500/30">
            <div className="font-bold text-lime-400">High-Intensity Tennis (1.00x)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tournament match, Dad 1:1, intensive basket feeding</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-amber-500/30">
            <div className="font-bold text-amber-400">Practice Match Play (0.80x)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Competitive practice sets, club tiebreak match play</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-indigo-500/30">
            <div className="font-bold text-indigo-400">Multisport Athleticism (0.70x)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">MAG Gymnastics, Taekwondo, Parkour classes</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-emerald-500/30">
            <div className="font-bold text-emerald-400">Squad Practice (0.60x)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Club group coaching, continuous group drills</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-amber-400/30">
            <div className="font-bold text-amber-300">S&C & Footwork (0.60x)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Speed ladder footwork, agility sprints, core stability</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-pink-500/30">
            <div className="font-bold text-pink-400">Pre-hab & Injury Prev (0.50x)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Shoulder rotator cuff bands, foam roll, hip mobility</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-cyan-500/30">
            <div className="font-bold text-cyan-400">Intentional Rest (0.50x)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Screen-free active recovery: legs-up, breathwork, quiet reading</div>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-sky-500/30">
            <div className="font-bold text-sky-400">Tennis IQ & Video (0.50x)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Match scouting/charting, tactical video breakdown</div>
          </div>
        </div>
      </div>
    </div>
  );
};
