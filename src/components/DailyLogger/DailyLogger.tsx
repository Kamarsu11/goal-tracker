import React, { useState, useEffect } from 'react';
import { ChildProfile, DayLog, ActivityBlock } from '../../types';
import { DataService } from '../../services/dataService';
import { DayHeader } from './DayHeader';
import { Day24hBar } from './Day24hBar';
import { ActivityItem } from './ActivityItem';
import { AddActivityModal } from './AddActivityModal';
import { EditActivityModal } from './EditActivityModal';
import { adjustTimeString, calculateDurationHours } from '../../utils/categories';
import { Plus, Sparkles, ArrowDownUp } from 'lucide-react';

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
  dayLog: initialDayLog,
  onRefreshDayLog,
  onSwitchChild,
}) => {
  const [currentDayLog, setCurrentDayLog] = useState<DayLog | null>(initialDayLog);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ActivityBlock | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Keep local state in sync whenever prop changes
  useEffect(() => {
    setCurrentDayLog(initialDayLog ? { ...initialDayLog, blocks: [...initialDayLog.blocks] } : null);
  }, [initialDayLog]);

  if (!currentDayLog) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        Loading day data...
      </div>
    );
  }

  // Helper to immediately update state and save to DB
  const updateAndPersist = async (updated: DayLog) => {
    setCurrentDayLog({ ...updated, blocks: [...updated.blocks] });
    await DataService.saveDayLog(updated);
    onRefreshDayLog();
  };

  // Toggle complete / pending
  const handleToggleComplete = async (blockId: string) => {
    const updatedBlocks = currentDayLog.blocks.map(b =>
      b.id === blockId ? { ...b, completed: !b.completed } : b
    );
    await updateAndPersist({ ...currentDayLog, blocks: updatedBlocks });
  };

  // Toggle Cancel
  const handleToggleCancel = async (blockId: string) => {
    const updatedBlocks = currentDayLog.blocks.map(b =>
      b.id === blockId ? { ...b, isCancelled: !b.isCancelled } : b
    );
    await updateAndPersist({ ...currentDayLog, blocks: updatedBlocks });
  };

  // Adjust duration +/- 15 mins
  const handleAdjustDuration = async (blockId: string, deltaMinutes: number) => {
    const updatedBlocks = currentDayLog.blocks.map(b => {
      if (b.id !== blockId) return b;
      const newEndTime = adjustTimeString(b.endTime, deltaMinutes);
      const newDuration = calculateDurationHours(b.startTime, newEndTime);
      return {
        ...b,
        endTime: newEndTime,
        durationHours: newDuration,
      };
    });
    await updateAndPersist({ ...currentDayLog, blocks: updatedBlocks });
  };

  // Delete activity
  const handleDeleteBlock = async (blockId: string) => {
    const updatedBlocks = currentDayLog.blocks.filter(b => b.id !== blockId);
    await updateAndPersist({ ...currentDayLog, blocks: updatedBlocks });
  };

  // Add activity
  const handleAddBlock = async (newBlockData: Omit<ActivityBlock, 'id'>) => {
    const newBlock: ActivityBlock = {
      ...newBlockData,
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updatedBlocks = [...currentDayLog.blocks, newBlock];
    await updateAndPersist({ ...currentDayLog, blocks: updatedBlocks });
  };

  // Save edited block
  const handleSaveEditedBlock = async (updatedBlock: ActivityBlock) => {
    const updatedBlocks = currentDayLog.blocks.map(b =>
      b.id === updatedBlock.id ? updatedBlock : b
    );
    await updateAndPersist({ ...currentDayLog, blocks: updatedBlocks });
  };

  // Move block Up / Down (Hold & Move Alternative)
  const handleMoveBlock = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentDayLog.blocks.length) return;
    const newBlocks = [...currentDayLog.blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    await updateAndPersist({ ...currentDayLog, blocks: newBlocks });
  };

  // Drag & Drop Handlers
  const handleDragStart = (_e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, _index: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    const newBlocks = [...currentDayLog.blocks];
    const [moved] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(dropIndex, 0, moved);
    setDraggedIndex(null);
    await updateAndPersist({ ...currentDayLog, blocks: newBlocks });
  };

  // Auto-Sort all activities in chronological time order
  const handleAutoSortByTime = async () => {
    const sorted = [...currentDayLog.blocks].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    await updateAndPersist({ ...currentDayLog, blocks: sorted });
  };

  // Apply Preset
  const handleApplyPreset = async (
    preset: 'default_term' | 'school_holiday' | 'sick_day' | 'match_day'
  ) => {
    const newLog = await DataService.applyPreset(currentProfile.id, currentDate, preset);
    setCurrentDayLog({ ...newLog, blocks: [...newLog.blocks] });
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
      onRefreshDayLog();
    }
  };

  // Clear Day
  const handleClearDay = async () => {
    if (window.confirm(`Clear all activities for ${currentDate}?`)) {
      const empty = await DataService.clearDay(currentProfile.id, currentDate);
      setCurrentDayLog({ ...empty, blocks: [] });
      onRefreshDayLog();
    }
  };

  // Toggle Day Status between Confirmed and Unconfirmed Draft
  const handleToggleStatus = async () => {
    const nextStatus = currentDayLog.status === 'confirmed' ? ('unlogged' as const) : ('confirmed' as const);
    const updated: DayLog = { ...currentDayLog, status: nextStatus };
    await updateAndPersist(updated);
  };

  const blocks = currentDayLog.blocks || [];

  return (
    <div className="space-y-4 pb-36 sm:pb-24">
      {/* Day Navigation & Status Header */}
      <DayHeader
        currentDate={currentDate}
        onDateChange={onDateChange}
        currentProfile={currentProfile}
        otherProfile={otherProfile}
        dayLog={currentDayLog}
        onApplyPreset={handleApplyPreset}
        onCopyToSibling={handleCopyToSibling}
        onClearDay={handleClearDay}
        onToggleStatus={handleToggleStatus}
      />

      {/* 24-Hour Visual Bar */}
      <Day24hBar blocks={blocks} status={currentDayLog.status} />

      {/* Activities List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 flex-wrap gap-2">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <span>Scheduled Activities</span>
            <span className="text-xs text-slate-400 font-normal">
              ({blocks.length} items)
            </span>
          </h3>

          <div className="flex items-center gap-1.5">
            {blocks.length > 1 && (
              <button
                onClick={handleAutoSortByTime}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-medium active:scale-95 transition-all"
                title="Sort all activities chronologically by start time"
              >
                <ArrowDownUp className="w-3.5 h-3.5 text-tennis-400" />
                <span>Auto-Sort by Time</span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-tennis-500/10 hover:bg-tennis-500/20 border border-tennis-500/40 text-tennis-400 rounded-xl text-xs font-bold active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Activity
            </button>
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="bg-brand-card/40 border border-dashed border-slate-700/80 rounded-2xl p-8 text-center space-y-3">
            <p className="text-slate-400 text-xs">No activities logged for this day yet.</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
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
            {blocks.map((block, idx) => (
              <ActivityItem
                key={block.id || idx}
                block={block}
                index={idx}
                totalCount={blocks.length}
                onToggleComplete={handleToggleComplete}
                onToggleCancel={handleToggleCancel}
                onAdjustDuration={handleAdjustDuration}
                onEdit={block => setEditingBlock(block)}
                onDelete={handleDeleteBlock}
                onMoveUp={i => handleMoveBlock(i, 'up')}
                onMoveDown={i => handleMoveBlock(i, 'down')}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button for quick reach on mobile */}
      <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,16px))] right-5 z-30 sm:hidden">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 rounded-full bg-tennis-500 text-black flex items-center justify-center shadow-2xl active:scale-90 transition-transform font-bold border-2 border-black/40"
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
