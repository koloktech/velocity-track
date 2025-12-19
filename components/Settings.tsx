import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { saveSettings, getSettings, generateMockData } from '../services/storageService';
import { Shield, Database, Cloud, AlertTriangle, Cpu } from 'lucide-react';

interface SettingsProps {
  onRefresh: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onRefresh }) => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    alert("SYSTEM CONFIG SAVED");
  };

  const handleGenerateData = () => {
    if (window.confirm("Overwrite with Test Data?")) {
      generateMockData();
      onRefresh();
      alert("Test data loaded.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Security Section */}
      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-green-900/50 pb-2">
            <Shield className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Cloud <span className="text-green-500">Link</span></h2>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 p-8 skew-fast relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-green-900/10 to-transparent pointer-events-none"></div>
            
            <div className="unskew-fast space-y-6">
                <p className="text-neutral-400 font-mono text-sm max-w-2xl">
                    <span className="text-green-500 font-bold">SECURE PROTOCOL:</span> Connect to Google Sheets via Web App Proxy. No client-side keys exposed.
                </p>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-black border border-neutral-800">
                        <input 
                            type="checkbox" 
                            id="useSheets"
                            checked={settings.useGoogleSheets}
                            onChange={(e) => setSettings({...settings, useGoogleSheets: e.target.checked})}
                            className="w-6 h-6 rounded-none border-neutral-700 bg-neutral-900 text-green-600 focus:ring-green-500 focus:ring-offset-black"
                        />
                        <label htmlFor="useSheets" className="text-white font-bold uppercase tracking-wider cursor-pointer select-none hover:text-green-400 transition-colors">Activate Cloud Sync</label>
                    </div>

                    {settings.useGoogleSheets && (
                    <div className="space-y-3 animate-in slide-in-from-left-4">
                        <label className="text-xs font-black text-green-500 uppercase tracking-widest">Target URL (Apps Script)</label>
                        <div className="flex gap-0">
                            <div className="bg-neutral-800 px-3 py-3 flex items-center text-neutral-500">
                                <Cpu size={16} />
                            </div>
                            <input 
                            type={showKey ? "text" : "password"}
                            value={settings.googleScriptUrl}
                            onChange={(e) => setSettings({...settings, googleScriptUrl: e.target.value})}
                            placeholder="https://script.google.com/..."
                            className="flex-1 bg-black border border-neutral-800 border-l-0 text-green-400 px-4 py-3 font-mono text-sm focus:border-green-500 focus:outline-none"
                            />
                            <button 
                            onClick={() => setShowKey(!showKey)}
                            className="px-6 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-white border-t border-b border-r border-neutral-800"
                            >
                            {showKey ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    )}
                </div>
                
                <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-black uppercase italic tracking-wider transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                    Apply Config
                </button>
            </div>
        </div>
      </section>

      {/* Data Management */}
      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-2">
            <Database className="w-6 h-6 text-cyan-500" />
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Data <span className="text-cyan-500">Control</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-neutral-900 border border-cyan-900/30 skew-fast hover:border-cyan-500/50 transition-colors">
                <div className="unskew-fast">
                    <h3 className="font-black text-white mb-2 flex items-center gap-2 uppercase italic text-lg">
                        <Cloud className="w-5 h-5 text-cyan-500" /> Simulator
                    </h3>
                    <p className="text-xs text-neutral-500 mb-6 font-mono">
                        Inject sample telemetry data for system testing.
                    </p>
                    <button 
                        onClick={handleGenerateData}
                        className="w-full py-3 bg-cyan-900/20 hover:bg-cyan-500 text-cyan-400 hover:text-black border border-cyan-500/50 hover:border-cyan-500 font-bold uppercase tracking-wider transition-all"
                    >
                        Load Test Data
                    </button>
                </div>
            </div>

            <div className="p-6 bg-neutral-900 border border-red-900/30 skew-fast hover:border-red-600/50 transition-colors">
                <div className="unskew-fast">
                    <h3 className="font-black text-white mb-2 flex items-center gap-2 uppercase italic text-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" /> Factory Reset
                    </h3>
                    <p className="text-xs text-neutral-500 mb-6 font-mono">
                        Purge all local storage. Irreversible action.
                    </p>
                    <button 
                        onClick={() => {
                            if(window.confirm("WARNING: PURGE ALL DATA?")) {
                                localStorage.clear();
                                onRefresh();
                            }
                        }}
                        className="w-full py-3 bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 hover:border-red-600 font-bold uppercase tracking-wider transition-all"
                    >
                        Purge System
                    </button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;