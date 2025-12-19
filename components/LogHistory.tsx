import React from 'react';
import { FuelLog } from '../types';
import { Trash2 } from 'lucide-react';

interface LogHistoryProps {
  logs: FuelLog[];
  onDelete: (id: string) => void;
}

const LogHistory: React.FC<LogHistoryProps> = ({ logs, onDelete }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="border-t-2 border-green-500 bg-neutral-900/50 backdrop-blur">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b-2 border-neutral-800">
                <th className="p-5 text-xs font-black text-green-500 uppercase tracking-widest italic">Date</th>
                <th className="p-5 text-xs font-black text-green-500 uppercase tracking-widest italic">Fuel Brand</th>
                <th className="p-5 text-xs font-black text-neutral-500 uppercase tracking-widest italic text-right">Dist (km)</th>
                <th className="p-5 text-xs font-black text-neutral-500 uppercase tracking-widest italic text-right">Liters</th>
                <th className="p-5 text-xs font-black text-neutral-500 uppercase tracking-widest italic text-right">Cost (RM)</th>
                <th className="p-5 text-xs font-black text-white uppercase tracking-widest italic text-right bg-green-900/20">km/L</th>
                <th className="p-5 text-xs font-black text-neutral-500 uppercase tracking-widest italic text-center">Opt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="text-2xl font-black italic uppercase text-neutral-700">Garage Empty</div>
                    <div className="text-xs text-neutral-500 uppercase tracking-widest mt-2">No fuel logs recorded</div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-neutral-800/50 transition-colors border-l-2 border-transparent hover:border-green-500">
                    <td className="p-5 text-white font-mono font-bold">{log.date}</td>
                    <td className="p-5">
                      <span className={`uppercase font-black italic text-sm ${
                        log.fuelBrand === 'Shell' ? 'text-yellow-500' :
                        log.fuelBrand === 'Petronas' ? 'text-teal-400' :
                        log.fuelBrand === 'Petron' ? 'text-blue-500' :
                        'text-neutral-400'
                      }`}>
                        {log.fuelBrand}
                      </span>
                    </td>
                    <td className="p-5 text-right font-mono text-neutral-300 group-hover:text-white">{log.distance.toFixed(1)}</td>
                    <td className="p-5 text-right font-mono text-neutral-300">{log.litres.toFixed(2)}</td>
                    <td className="p-5 text-right font-mono text-neutral-300">{log.amountRM.toFixed(2)}</td>
                    <td className="p-5 text-right font-mono font-bold text-green-400 text-lg bg-green-900/5 group-hover:bg-green-500/10 group-hover:text-green-300">{log.kmPerLiter.toFixed(2)}</td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => {
                            if(window.confirm('Scrap this record?')) onDelete(log.id);
                        }}
                        className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogHistory;