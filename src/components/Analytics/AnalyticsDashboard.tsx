import React, { useState, useEffect } from 'react';
import { ChildProfile, DailySummary, DayLog } from '../../types';
import { DataService } from '../../services/dataService';
import { StatsSummaryCards } from './StatsSummaryCards';
import { CumulativeGrowthCurve } from './CumulativeGrowthCurve';
import { TimeDistributionChart } from './TimeDistributionChart';
import { TargetVsActualBarChart } from './TargetVsActualBarChart';
import { UnnoticedTimeMonitor } from './UnnoticedTimeMonitor';
import { FullscreenChartModal } from './FullscreenChartModal';
import { Calendar, Users, BarChart3, Filter } from 'lucide-react';

interface AnalyticsDashboardProps {
  currentProfile: ChildProfile;
  otherProfile?: ChildProfile;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  currentProfile,
  otherProfile,
}) => {
  const [rangePreset, setRangePreset] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [startDate, setStartDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [showBothKids, setShowBothKids] = useState(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const [k1Summaries, setK1Summaries] = useState<DailySummary[]>([]);
  const [k2Summaries, setK2Summaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [allProfiles, setAllProfiles] = useState<ChildProfile[]>([]);

  // Handle preset range changes
  const handlePresetChange = (preset: 'today' | 'yesterday' | 'custom') => {
    setRangePreset(preset);
    const today = new Date();

    if (preset === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      setStartDate(yesterdayStr);
      setEndDate(yesterdayStr);
    }
  };

  // Fetch summaries for selected date range
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const profiles = await DataService.getProfiles();
      setAllProfiles(profiles);

      const p1 = profiles.find(p => p.id === 'kid1') || currentProfile;
      const p2 = profiles.find(p => p.id === 'kid2') || otherProfile;

      const start = new Date(startDate + 'T12:00:00');
      const end = new Date(endDate + 'T12:00:00');

      const k1List: DailySummary[] = [];
      const k2List: DailySummary[] = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];

        // Kid 1
        const k1Log = await DataService.loadOrCreateDay('kid1', dateStr);
        k1List.push(DataService.calculateDailySummary(k1Log, p1));

        // Kid 2
        if (p2) {
          const k2Log = await DataService.loadOrCreateDay('kid2', dateStr);
          k2List.push(DataService.calculateDailySummary(k2Log, p2));
        }
      }

      setK1Summaries(k1List);
      setK2Summaries(k2List);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [startDate, endDate, currentProfile.id, otherProfile?.id]);

  const k1Profile = allProfiles.find(p => p.id === 'kid1') || currentProfile;
  const k2Profile = allProfiles.find(p => p.id === 'kid2') || otherProfile;

  const selectedKidSummaries = currentProfile.id === 'kid2' ? k2Summaries : k1Summaries;
  const selectedProfile = currentProfile;

  return (
    <div className="space-y-4 pb-20">
      {/* Filter & Range Bar */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-tennis-500/20 text-tennis-400 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Performance & Growth Analytics
              </h2>
              <p className="text-xs text-slate-400">
                Tracking {currentProfile.name} vs Future Tennis Pro Curves
              </p>
            </div>
          </div>

          {/* Sibling Toggle */}
          {otherProfile && (
            <button
              onClick={() => setShowBothKids(!showBothKids)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold active:scale-95 transition-all ${
                showBothKids
                  ? 'bg-indigo-950/70 border-indigo-700 text-indigo-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{showBothKids ? '👥 Comparing Both Boys' : '👤 Single Boy View'}</span>
            </button>
          )}
        </div>

        {/* Date Presets */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-brand-border/40 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium">Range:</span>
            <button
              onClick={() => handlePresetChange('today')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                rangePreset === 'today'
                  ? 'bg-tennis-500 text-black font-bold border-tennis-500 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handlePresetChange('yesterday')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                rangePreset === 'yesterday'
                  ? 'bg-tennis-500 text-black font-bold border-tennis-500 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setRangePreset('custom')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                rangePreset === 'custom'
                  ? 'bg-tennis-500 text-black font-bold border-tennis-500 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom Date Inputs */}
          {rangePreset === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading analytics data...</div>
      ) : (
        <>
          {/* Key Summary Metric Cards */}
          <StatsSummaryCards summaries={selectedKidSummaries} profile={selectedProfile} />

          {/* Chart 1: Cumulative Growth Trajectory (Pinch to Zoom & Fullscreen) */}
          <CumulativeGrowthCurve
            k1Summaries={k1Summaries}
            k2Summaries={k2Summaries}
            profile1={k1Profile}
            profile2={k2Profile}
            showBothKids={showBothKids}
            onOpenFullscreen={() => setIsFullscreenOpen(true)}
          />

          {/* Chart 2: Target vs Actual Breakdown */}
          <TargetVsActualBarChart summaries={selectedKidSummaries} profile={selectedProfile} />

          {/* Chart 3: 24-Hour Stacked Daily Allocation */}
          <TimeDistributionChart summaries={selectedKidSummaries} />

          {/* Chart 4: Unnoticed Time / Silent Killer Monitor */}
          <UnnoticedTimeMonitor summaries={selectedKidSummaries} />

          {/* Fullscreen Interactive Zoom Modal */}
          <FullscreenChartModal
            isOpen={isFullscreenOpen}
            onClose={() => setIsFullscreenOpen(false)}
            k1Summaries={k1Summaries}
            k2Summaries={k2Summaries}
            profile1={k1Profile}
            profile2={k2Profile}
            showBothKids={showBothKids}
          />
        </>
      )}
    </div>
  );
};
