import React from 'react';
import { ChildProfile } from '../types';
import { Calendar, BarChart3, Settings, Trophy, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'logger' | 'analytics' | 'settings';
  onTabChange: (tab: 'logger' | 'analytics' | 'settings') => void;
  profiles: ChildProfile[];
  currentProfile: ChildProfile;
  onSelectProfile: (profileId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  profiles,
  currentProfile,
  onSelectProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* App Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-700 text-tennis-400 flex items-center justify-center font-black shadow-lg shadow-tennis-500/10">
            <Trophy className="w-5 h-5 text-tennis-400" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>Goal Tracker</span>
            </h1>
            <p className="text-[10px] text-slate-400">Tennis Pro Benchmark Tracker</p>
          </div>
        </div>

        {/* Child Profile Switcher (Elder vs Younger) */}
        <div className="flex items-center gap-1 bg-brand-card p-1 rounded-2xl border border-brand-border shadow-inner">
          {profiles.map(p => {
            const isSelected = p.id === currentProfile.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProfile(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? p.id === 'kid1'
                      ? 'bg-lime-500 text-black shadow-md'
                      : 'bg-cyan-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{p.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-80">({p.age}y)</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => onTabChange('logger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'logger' ? 'bg-tennis-500 text-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Logger
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'analytics' ? 'bg-tennis-500 text-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentTab === 'settings' ? 'bg-tennis-500 text-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
        </div>
      </div>
    </header>
  );
};
