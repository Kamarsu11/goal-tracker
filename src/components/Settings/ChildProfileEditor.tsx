import React, { useState } from 'react';
import { ChildProfile } from '../../types';
import { User, Save, Check } from 'lucide-react';

interface ChildProfileEditorProps {
  profiles: ChildProfile[];
  onSaveProfile: (profile: ChildProfile) => Promise<void>;
}

export const ChildProfileEditor: React.FC<ChildProfileEditorProps> = ({
  profiles,
  onSaveProfile,
}) => {
  const [editedProfiles, setEditedProfiles] = useState<ChildProfile[]>(profiles);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleChange = (id: string, field: keyof ChildProfile, val: any) => {
    setEditedProfiles(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSave = async (profile: ChildProfile) => {
    await onSaveProfile(profile);
    setSavedNotice(profile.id);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Child Athlete Profiles</h3>
          <p className="text-xs text-slate-400">
            Age determines the dynamic Ideal Pro benchmark curve used in your graphs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {editedProfiles.map(p => (
          <div
            key={p.id}
            className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tennis-400 uppercase tracking-wider">
                {p.id === 'kid1' ? '👦 Elder Boy' : '👦 Younger Boy'}
              </span>
              <button
                onClick={() => handleSave(p)}
                className="flex items-center gap-1 px-3 py-1 bg-tennis-500 hover:bg-tennis-400 text-black rounded-lg text-xs font-bold active:scale-95 transition-all"
              >
                {savedNotice === p.id ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedNotice === p.id ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={p.name}
                onChange={e => handleChange(p.id, 'name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-100 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Current Age
                </label>
                <input
                  type="number"
                  min="8"
                  max="18"
                  value={p.age}
                  onChange={e => handleChange(p.id, 'age', parseInt(e.target.value, 10) || 10)}
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Birth Year
                </label>
                <input
                  type="number"
                  value={p.birthYear}
                  onChange={e => handleChange(p.id, 'birthYear', parseInt(e.target.value, 10) || 2015)}
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Primary Goal Sport
              </label>
              <input
                type="text"
                value={p.primarySport}
                onChange={e => handleChange(p.id, 'primarySport', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-100"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
