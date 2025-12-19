import React, { useState, useEffect } from 'react';
import { FuelLog } from '../types';
import { Save, AlertCircle, Fuel } from 'lucide-react';
import { saveLog } from '../services/storageService';

interface AddLogProps {
  onSave: () => void;
  lastOdo: number;
}

const AddLog: React.FC<AddLogProps> = ({ onSave, lastOdo }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    fuelBrand: '',
    amountRM: '',
    litres: '',
    odoStart: lastOdo.toString(),
    odoEnd: '',
    notes: ''
  });

  const [stats, setStats] = useState({
    distance: 0,
    kmPerRM: 0,
    kmPerLiter: 0
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = parseFloat(formData.odoStart);
    const end = parseFloat(formData.odoEnd);
    const lit = parseFloat(formData.litres);
    const amt = parseFloat(formData.amountRM);

    if (!isNaN(start) && !isNaN(end) && end > start) {
      const dist = end - start;
      const kpl = !isNaN(lit) && lit > 0 ? dist / lit : 0;
      const kpm = !isNaN(amt) && amt > 0 ? dist / amt : 0;

      setStats({
        distance: parseFloat(dist.toFixed(1)),
        kmPerLiter: parseFloat(kpl.toFixed(2)),
        kmPerRM: parseFloat(kpm.toFixed(2))
      });
    } else {
      setStats({ distance: 0, kmPerRM: 0, kmPerLiter: 0 });
    }
  }, [formData.odoStart, formData.odoEnd, formData.litres, formData.amountRM]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fuelBrand || !formData.amountRM || !formData.litres || !formData.odoEnd) {
      setError("FILL ALL REQUIRED FIELDS");
      return;
    }

    if (stats.distance <= 0) {
      setError("ODO END MUST BE > START");
      return;
    }

    const newLog: FuelLog = {
      id: crypto.randomUUID(),
      date: formData.date,
      fuelBrand: formData.fuelBrand,
      amountRM: parseFloat(formData.amountRM),
      litres: parseFloat(formData.litres),
      odoStart: parseFloat(formData.odoStart),
      odoEnd: parseFloat(formData.odoEnd),
      distance: stats.distance,
      kmPerRM: stats.kmPerRM,
      kmPerLiter: stats.kmPerLiter,
      notes: formData.notes,
      timestamp: Date.now()
    };

    const success = await saveLog(newLog);
    if (success) {
      onSave();
    } else {
      setError("SAVE FAILED. RETRY.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-l-4 border-green-500 pl-6 mb-8">
        <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
          Refuel <span className="text-green-500">Station</span>
        </h2>
        <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mt-1">
          Input your latest pit stop data
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 p-1 shadow-2xl relative skew-fast">
        <div className="absolute top-0 right-0 p-8 opacity-5 unskew-fast pointer-events-none">
           <Fuel size={150} />
        </div>

        <div className="bg-neutral-950/90 p-8 unskew-fast relative z-10">
            {error && (
            <div className="mb-6 p-4 bg-red-900/20 border-l-4 border-red-500 flex items-center gap-3 text-red-500">
                <AlertCircle size={24} />
                <span className="font-bold italic uppercase tracking-wider">{error}</span>
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="group">
                <label className="block text-xs font-black text-green-500 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Date</label>
                <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-black border-b-2 border-neutral-800 text-white px-4 py-3 font-mono focus:border-green-500 focus:outline-none transition-all placeholder-neutral-700"
                />
                </div>

                <div className="group">
                <label className="block text-xs font-black text-green-500 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Fuel Brand</label>
                <select 
                    name="fuelBrand"
                    value={formData.fuelBrand}
                    onChange={handleChange}
                    className="w-full bg-black border-b-2 border-neutral-800 text-white px-4 py-3 font-bold uppercase focus:border-green-500 focus:outline-none transition-all"
                >
                    <option value="" className="text-neutral-500">Select Brand</option>
                    <option value="Shell">Shell</option>
                    <option value="Petronas">Petronas</option>
                    <option value="Petron">Petron</option>
                    <option value="BHPetrol">BHPetrol</option>
                    <option value="Caltex">Caltex</option>
                    <option value="Other">Other</option>
                </select>
                </div>

                <div className="group">
                <label className="block text-xs font-black text-green-500 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Amount (RM)</label>
                <input 
                    type="number" 
                    name="amountRM"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.amountRM}
                    onChange={handleChange}
                    className="w-full bg-black border-b-2 border-neutral-800 text-white px-4 py-3 font-mono text-xl focus:border-green-500 focus:outline-none transition-all"
                />
                </div>

                <div className="group">
                <label className="block text-xs font-black text-green-500 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Litres (L)</label>
                <input 
                    type="number" 
                    name="litres"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.litres}
                    onChange={handleChange}
                    className="w-full bg-black border-b-2 border-neutral-800 text-white px-4 py-3 font-mono text-xl focus:border-green-500 focus:outline-none transition-all"
                />
                </div>

                <div className="group">
                <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-2">Odometer Start</label>
                <input 
                    type="number" 
                    name="odoStart"
                    value={formData.odoStart}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border-b-2 border-neutral-800 text-neutral-400 px-4 py-3 font-mono text-lg focus:border-green-500 focus:outline-none transition-all"
                />
                </div>

                <div className="group">
                <label className="block text-xs font-black text-green-500 uppercase tracking-widest mb-2">Odometer End</label>
                <input 
                    type="number" 
                    name="odoEnd"
                    placeholder="Current"
                    value={formData.odoEnd}
                    onChange={handleChange}
                    className="w-full bg-black border-2 border-green-500/50 text-white px-4 py-3 font-mono text-xl focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.2)] focus:outline-none transition-all"
                />
                </div>
            </div>

            {/* Live Telemetry Box */}
            <div className="grid grid-cols-3 gap-1 bg-black p-2 mt-8 border border-neutral-800">
                <div className="text-center p-4 border border-neutral-900">
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Trip Dist</div>
                <div className="font-mono text-2xl font-black italic text-white">{stats.distance} <span className="text-xs text-neutral-600">km</span></div>
                </div>
                <div className="text-center p-4 border border-neutral-900 bg-green-900/10">
                <div className="text-[10px] text-green-600 uppercase tracking-widest mb-1">Efficiency</div>
                <div className="font-mono text-2xl font-black italic text-green-500">{stats.kmPerLiter} <span className="text-xs text-green-800">km/L</span></div>
                </div>
                <div className="text-center p-4 border border-neutral-900">
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Economy</div>
                <div className="font-mono text-2xl font-black italic text-white">{stats.kmPerRM} <span className="text-xs text-neutral-600">km/RM</span></div>
                </div>
            </div>

            <div className="group">
                <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-2">Crew Notes</label>
                <textarea 
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-black border border-neutral-800 text-white px-4 py-3 focus:border-green-500 focus:outline-none transition-all"
                placeholder="Driving conditions, modifications, etc."
                />
            </div>

            <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-black font-black italic uppercase py-5 text-xl tracking-tighter skew-fast transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-1 active:translate-y-0"
            >
                <div className="unskew-fast flex items-center justify-center gap-2">
                <Save className="w-6 h-6" />
                Commit Data
                </div>
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddLog;