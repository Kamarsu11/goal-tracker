import React, { useState, useRef } from 'react';
import { DataService } from '../../services/dataService';
import { Download, Upload, FileSpreadsheet, RefreshCw, CheckCircle, AlertCircle, Database } from 'lucide-react';

interface DataBackupRestoreProps {
  onDataChanged: () => void;
}

export const DataBackupRestore: React.FC<DataBackupRestoreProps> = ({ onDataChanged }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // 1. Export JSON Backup
  const handleExportJSON = async () => {
    try {
      setIsExporting(true);
      const json = await DataService.exportJSONBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `tennis-goal-tracker-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showStatus('success', 'JSON backup file downloaded successfully!');
    } catch (err: any) {
      showStatus('error', `Backup failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Import JSON Backup
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const text = event.target?.result as string;
        const res = await DataService.importJSONBackup(text);
        if (res.success) {
          showStatus('success', res.message);
          onDataChanged();
        } else {
          showStatus('error', res.message);
        }
      } catch (err: any) {
        showStatus('error', `Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 3. Export CSV
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const csv = await DataService.exportCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `tennis-goal-tracker-data-${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showStatus('success', 'CSV spreadsheet file downloaded successfully!');
    } catch (err: any) {
      showStatus('error', `CSV export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">
            Data Storage, Multi-Device Backup & CSV
          </h3>
          <p className="text-xs text-slate-400">
            Your data is saved securely in your browser's IndexedDB. Export JSON to sync between iPhone & PC.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border-red-800 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Export JSON */}
        <button
          onClick={handleExportJSON}
          disabled={isExporting}
          className="flex flex-col items-center justify-center p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-tennis-500/60 rounded-2xl text-center space-y-2 active:scale-98 transition-all"
        >
          <div className="p-2.5 bg-tennis-500/20 text-tennis-400 rounded-xl">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Download Backup (JSON)</div>
            <div className="text-[10px] text-slate-400">Full data backup for multi-device sync</div>
          </div>
        </button>

        {/* Import JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/60 rounded-2xl text-center space-y-2 active:scale-98 transition-all"
        >
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Restore Backup (JSON)</div>
            <div className="text-[10px] text-slate-400">Load backup file from other device</div>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
        />

        {/* Export CSV */}
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex flex-col items-center justify-center p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 rounded-2xl text-center space-y-2 active:scale-98 transition-all"
        >
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Download CSV Spreadsheet</div>
            <div className="text-[10px] text-slate-400">Open in Excel or Google Sheets</div>
          </div>
        </button>
      </div>
    </div>
  );
};
