import React from 'react';
import { Calendar, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'logger' | 'analytics' | 'settings';
  onTabChange: (tab: 'logger' | 'analytics' | 'settings') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-dark/95 backdrop-blur-lg border-t border-brand-border/80 px-4 py-2 pb-[calc(0.5rem+var(--sab,0px))]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Daily Logger Tab */}
        <button
          onClick={() => onTabChange('logger')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            currentTab === 'logger'
              ? 'text-tennis-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Daily Log</span>
        </button>

        {/* Analytics Tab */}
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            currentTab === 'analytics'
              ? 'text-tennis-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">Analytics</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            currentTab === 'settings'
              ? 'text-tennis-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Settings</span>
        </button>
      </div>
    </nav>
  );
};
