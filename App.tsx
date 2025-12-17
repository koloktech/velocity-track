import React, { useState, useEffect } from 'react';
import { Page, FuelLog } from './types';
import { getLogs, deleteLog } from './services/storageService';
import Dashboard from './components/Dashboard';
import AddLog from './components/AddLog';
import LogHistory from './components/LogHistory';
import Settings from './components/Settings';
import { LayoutDashboard, PlusCircle, History, Settings as SettingsIcon, Gauge, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [logs, setLogs] = useState<FuelLog[]>([]);

  const refreshLogs = () => {
    setLogs(getLogs());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const handleDelete = (id: string) => {
    deleteLog(id);
    refreshLogs();
  };

  const handleSaveLog = () => {
    refreshLogs();
    setCurrentPage(Page.DASHBOARD);
  };

  // Determine last odometer reading for the form
  const lastOdo = logs.length > 0 ? logs[0].odoEnd : 0;

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-0 md:pl-64 text-white overflow-y-auto">
      {/* Mobile Header */}
      <div className="md:hidden bg-black/80 backdrop-blur-md border-b border-green-900/50 p-4 sticky top-0 z-50 flex items-center justify-between shadow-[0_4px_20px_rgba(34,197,94,0.1)]">
        <div className="flex items-center gap-2 text-green-500">
          <Zap className="w-6 h-6 fill-green-500" />
          <span className="text-xl font-black italic tracking-tighter uppercase neon-text">
            Velocity<span className="text-white">Track</span>
          </span>
        </div>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-neutral-950 border-r border-neutral-900 z-50">
        <div className="p-8 flex items-center gap-2 text-green-500 mb-8 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
           <Zap className="w-8 h-8 fill-green-500" />
           <span className="text-2xl font-black italic tracking-tighter uppercase neon-text">
            Velocity<span className="text-white">Track</span>
          </span>
        </div>
        
        <nav className="flex-1 px-6 space-y-4">
          <NavButton 
            active={currentPage === Page.DASHBOARD} 
            onClick={() => setCurrentPage(Page.DASHBOARD)} 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
          />
          <NavButton 
            active={currentPage === Page.ADD_LOG} 
            onClick={() => setCurrentPage(Page.ADD_LOG)} 
            icon={<PlusCircle />} 
            label="Add Log" 
          />
          <NavButton 
            active={currentPage === Page.HISTORY} 
            onClick={() => setCurrentPage(Page.HISTORY)} 
            icon={<History />} 
            label="Garage Logs" 
          />
          <NavButton 
            active={currentPage === Page.SETTINGS} 
            onClick={() => setCurrentPage(Page.SETTINGS)} 
            icon={<SettingsIcon />} 
            label="Tuning" 
          />
        </nav>

        <div className="p-6">
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded skew-fast neon-border">
             <div className="unskew-fast text-center">
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Status</div>
                <div className="text-xs text-green-400 font-bold uppercase flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  System Online
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto relative z-10">
        <header className="mb-10 hidden md:block border-b border-neutral-800 pb-6">
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-2" style={{ textShadow: '2px 2px 0px #22c55e' }}>
            {currentPage === Page.DASHBOARD && "Performance HUD"}
            {currentPage === Page.ADD_LOG && "New Entry"}
            {currentPage === Page.HISTORY && "Garage History"}
            {currentPage === Page.SETTINGS && "System Tuning"}
          </h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">
            {currentPage === Page.DASHBOARD && "Live Telemetry & Statistics"}
            {currentPage === Page.ADD_LOG && "Input Refuel Data"}
            {currentPage === Page.HISTORY && "Previous Runs & Records"}
            {currentPage === Page.SETTINGS && "Configure Parameters"}
          </p>
        </header>

        {currentPage === Page.DASHBOARD && <Dashboard logs={logs} />}
        {currentPage === Page.ADD_LOG && <AddLog onSave={handleSaveLog} lastOdo={lastOdo} />}
        {currentPage === Page.HISTORY && <LogHistory logs={logs} onDelete={handleDelete} />}
        {currentPage === Page.SETTINGS && <Settings onRefresh={refreshLogs} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-950 border-t-2 border-green-600 p-2 grid grid-cols-4 gap-1 z-50 pb-safe">
        <MobileNavButton active={currentPage === Page.DASHBOARD} onClick={() => setCurrentPage(Page.DASHBOARD)} icon={<LayoutDashboard />} label="HUD" />
        <MobileNavButton active={currentPage === Page.ADD_LOG} onClick={() => setCurrentPage(Page.ADD_LOG)} icon={<PlusCircle />} label="Add" />
        <MobileNavButton active={currentPage === Page.HISTORY} onClick={() => setCurrentPage(Page.HISTORY)} icon={<History />} label="Logs" />
        <MobileNavButton active={currentPage === Page.SETTINGS} onClick={() => setCurrentPage(Page.SETTINGS)} icon={<SettingsIcon />} label="Tune" />
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full group relative flex items-center px-6 py-4 transition-all skew-fast border-2 uppercase font-black italic tracking-wide ${
      active 
        ? 'bg-green-600 border-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
        : 'bg-transparent border-neutral-800 text-neutral-500 hover:border-green-500/50 hover:text-green-400'
    }`}
  >
    <div className="unskew-fast flex items-center gap-3">
      {React.cloneElement(icon, { size: 24, className: active ? 'stroke-black' : 'stroke-current' })}
      <span>{label}</span>
    </div>
    {/* Decorative corner accent */}
    {active && <div className="absolute top-0 right-0 w-2 h-2 bg-white"></div>}
    {active && <div className="absolute bottom-0 left-0 w-2 h-2 bg-white"></div>}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 uppercase italic font-bold skew-fast ${
      active ? 'bg-green-600 text-black' : 'text-neutral-500 bg-neutral-900'
    }`}
  >
    <div className="unskew-fast flex flex-col items-center">
      {React.cloneElement(icon, { size: 20 })}
      <span className="text-[10px] mt-1 tracking-wider">{label}</span>
    </div>
  </button>
);

export default App;