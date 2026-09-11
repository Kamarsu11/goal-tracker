import React, { useState } from 'react';
import { ChildProfile, DayLog, ActivityBlock } from '../../types';
import { DataService } from '../../services/dataService';
import { DayHeader } from './DayHeader';
import { Day24hBar } from './Day24hBar';
import { ActivityItem } from './ActivityItem';
import { AddActivityModal } from './AddActivityModal';
import { EditActivityModal } from './EditActivityModal';
import { adjustTimeString, calculateDurationHours } from '../../utils/categories';
import { Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface DailyLoggerProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  currentProfile: ChildProfile;
  otherProfile?: ChildProfile;
  dayLog: DayLog | null;
  onRefreshDayLog: () => void;
  onSwitchChild: (childId: string) => void;
}

export const DailyLogger: React.FC<DailyLoggerProps> = ({
  currentDate,
  onDateChange,
  currentProfile,
  otherProfile,
  dayLog,
  onRefreshDayLog,
  onSwitchChild,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ActivityBlock | null>(null);

  if (!dayLog) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        Loading day data...
      </div>
    );
  }

  // Toggle complete / pending
  const handleToggleComplete = async (blockId: string) => {
    const updatedBlocks = dayLog.blocks.map(b =>
      b.id === blockId ? { ...b, completed: !b.completed } : b
    );
    await DataService.saveDayLog({ ...dayLog, blocks: updatedBlocks });
    onRefreshDayLog();
  };

  // Toggle Cancel
  const handleToggleCancel = async (blockId: string) => {
    const updatedBlocks = dayLog.blocks.map(b =>
      b.id === blockId ? { ...b, isCancelled: !b.isCancelled } : b
    );
    await DataService.saveDayLog({ ...dayLog, blocks: updatedBlocks });
    onRefreshDayLog();
  };

  // Adjust duration +/- 15 mins
  const handleAdjustDuration = async (blockId: string, deltaMinutes: number) => {
    const updatedBlocks = dayLog.blocks.map(b => {
      if (b.id !== blockId) return b;
      const newEndTime = adjustTimeString(b.endTime, deltaMinutes);
      const newDuration = calculateDurationHours(b.startTime, newEndTime);
      return {
        ...b,
        endTime: newEndTime,
        durationHours: newDuration,
      };
    });
    await DataService.saveDayLog({ ...dayLog, blocks: updatedBlocks });
    onRefreshDayLog();
  };

  // Delete activity
  const handleDeleteBlock = async (blockId: string) => {
    const updatedBlocks = dayLog.blocks.filter(b => b.id !== blockId);
    await DataService.saveDayLog({ ...dayLog, blocks: updatedBlocks });
    onRefreshDayLog();
  };

  // Add activity
  const handleAddBlock = async (newBlockData: Omit<ActivityBlock, 'id'>) => {
    const newBlock: ActivityBlock = {
      ...newBlockData,
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updatedBlocks = [...dayLog.blocks, newBlock].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    await DataService.saveDayLog({ ...dayLog, blocks: updatedBlocks });
    onRefreshDayLog();
  };

  // Save edited block
  const handleSaveEditedBlock = async (updatedBlock: ActivityBlock) => {
    const updatedBlocks = dayLog.blocks
      .map(b => (b.id === updatedBlock.id ? updatedBlock : b))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    await DataService.saveDayLog({ ...dayLog, blocks: updatedBlocks });
    onRefreshDayLog();
  };

  // Apply Preset
  const handleApplyPreset = async (
    preset: 'default_term' | 'school_holiday' | 'sick_day' | 'match_day'
  ) => {
    await DataService.applyPreset(currentProfile.id, currentDate, preset);
    onRefreshDayLog();
  };

  // Copy to Sibling
  const handleCopyToSibling = async () => {
    if (!otherProfile) return;
    if (
      window.confirm(
        `Copy this schedule to ${otherProfile.name}? This will overwrite ${otherProfile.name}'s schedule for ${currentDate}.`
      )
    ) {
      await DataService.copyDayToSibling(currentProfile.id, otherProfile.id, currentDate);
      alert(`Schedule successfully copied to ${otherProfile.name}!`);
    }
  };

  // Clear Day
  const handleClearDay = async () => {
    if (window.confirm(`Clear all activities for ${currentDate}?`)) {
      await DataService.clearDay(currentProfile.id, currentDate);
      onRefreshDayLog();
    }
  };

  // Toggle Day Status between Confirmed and Unconfirmed Draft
  const handleToggleStatus = async () => {
    const nextStatus = dayLog.status === 'confirmed' ? 'unlogged' : 'confirmed';
    await DataService.saveDayLog({
      ...dayLog,
      status: nextStatus,
    });
    onRefreshDayLog();
  };

  // Sort blocks by start time
  const sortedBlocks = [...dayLog.blocks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-4 pb-20">
      {/* Day Navigation & Status Header */}
      <DayHeader
        currentDate={currentDate}
        onDateChange={onDateChange}
        currentProfile={currentProfile}
        otherProfile={otherProfile}
        dayLog={dayLog}
        onApplyPreset={handleApplyPreset}
        onCopyToSibling={handleCopyToSibling}
        onClearDay={handleClearDay}
        onToggleStatus={handleToggleStatus}
      />

      {/* 24-Hour Visual Bar */}
      <Day24hBar blocks={dayLog.blocks} status={dayLog.status} />

      {/* Activities List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <span>Scheduled Activities</span>
            <span className="text-xs text-slate-400 font-normal">
              ({sortedBlocks.length} items)
            </span>
          </h3>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-tennis-500/10 hover:bg-tennis-500/20 border border-tennis-500/40 text-tennis-400 rounded-xl text-xs font-bold active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        </div>

        {sortedBlocks.length === 0 ? (
          <div className="bg-brand-card/40 border border-dashed border-slate-700/80 rounded-2xl p-8 text-center space-y-3">
            <p className="text-slate-400 text-xs">No activities logged for this day yet.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleApplyPreset('default_term')}
                className="flex items-center gap-1.5 px-4 py-2 bg-tennis-500 text-black text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4" /> Load Default Schedule
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 hover:bg-slate-700"
              >
                + Add Custom
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedBlocks.map(block => (
              <ActivityItem
                key={block.id}
                block={block}
                onToggleComplete={handleToggleComplete}
                onToggleCancel={handleToggleCancel}
                onAdjustDuration={handleAdjustDuration}
                onEdit={block => setEditingBlock(block)}
                onDelete={handleDeleteBlock}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button for quick reach on mobile */}
      <div className="fixed bottom-20 right-5 z-30 sm:hidden">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 rounded-full bg-tennis-500 text-black flex items-center justify-center shadow-2xl active:scale-90 transition-transform font-bold"
          title="Add Activity"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Add & Edit Modals */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBlock}
      />

      <EditActivityModal
        isOpen={!!editingBlock}
        block={editingBlock}
        onClose={() => setEditingBlock(null)}
        onSave={handleSaveEditedBlock}
      />
    </div>
  );
};
