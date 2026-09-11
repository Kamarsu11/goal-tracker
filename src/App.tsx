import React, { useState, useEffect } from 'react';
import { initializeDatabase } from './db';
import { DataService } from './services/dataService';
import { ChildProfile, DayLog } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DailyLogger } from './components/DailyLogger/DailyLogger';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { SettingsView } from './components/Settings/SettingsView';

export const App: React.FC = () => {
  const [isDbReady, setIsDbReady] = useState(false);
  const [currentTab, setCurrentTab] = useState<'logger' | 'analytics' | 'settings'>('logger');
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('kid1');
  const [currentDate, setCurrentDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [dayLog, setDayLog] = useState<DayLog | null>(null);

  // Initialize DB on mount
  useEffect(() => {
    async function init() {
      await initializeDatabase();
      const loadedProfiles = await DataService.getProfiles();
      setProfiles(loadedProfiles);
      setIsDbReady(true);
    }
    init();
  }, []);

  // Load active day log whenever child or date changes
  const loadActiveDay = async () => {
    if (!isDbReady || !selectedChildId) return;
    const log = await DataService.loadOrCreateDay(selectedChildId, currentDate);
    setDayLog(log);
  };

  useEffect(() => {
    loadActiveDay();
  }, [isDbReady, selectedChildId, currentDate]);

  if (!isDbReady || profiles.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-700 text-tennis-400 flex items-center justify-center text-3xl font-black animate-bounce shadow-2xl">
          🏆
        </div>
        <h2 className="text-xl font-bold text-slate-100">Loading Goal Tracker...</h2>
        <p className="text-xs text-slate-400">Initializing offline IndexedDB storage</p>
      </div>
    );
  }

  const currentProfile = profiles.find(p => p.id === selectedChildId) || profiles[0];
  const otherProfile = profiles.find(p => p.id !== selectedChildId);

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        profiles={profiles}
        currentProfile={currentProfile}
        onSelectProfile={id => setSelectedChildId(id)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5">
        {currentTab === 'logger' && (
          <DailyLogger
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            currentProfile={currentProfile}
            otherProfile={otherProfile}
            dayLog={dayLog}
            onRefreshDayLog={loadActiveDay}
            onSwitchChild={id => setSelectedChildId(id)}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            currentProfile={currentProfile}
            otherProfile={otherProfile}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            onDataChanged={async () => {
              const p = await DataService.getProfiles();
              setProfiles(p);
              loadActiveDay();
            }}
          />
        )}
      </main>

      {/* Bottom Tab Bar for Mobile */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};
