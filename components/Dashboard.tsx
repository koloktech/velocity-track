import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FuelLog } from '../types';
import { Zap, Droplet, Map, TrendingUp } from 'lucide-react';

interface DashboardProps {
  logs: FuelLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  // Calculate Aggregates
  const totalDistance = logs.reduce((acc, log) => acc + log.distance, 0);
  const totalSpent = logs.reduce((acc, log) => acc + log.amountRM, 0);
  const totalLitres = logs.reduce((acc, log) => acc + log.litres, 0);
  const avgKmL = totalLitres > 0 ? (totalDistance / totalLitres).toFixed(2) : "0.00";
  const avgKmRM = totalSpent > 0 ? (totalDistance / totalSpent).toFixed(2) : "0.00";

  // Prepare Chart Data (Reverse to show chronological order left-to-right)
  const chartData = [...logs].reverse().map(log => ({
    date: log.date,
    efficiency: log.kmPerLiter,
    cost: log.amountRM
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Stats as "Gauges" */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Avg Efficiency" 
          value={avgKmL} 
          unit="km/L" 
          icon={<Zap className="w-6 h-6" />} 
          type="primary"
        />
        <StatCard 
          title="Total Spent" 
          value={totalSpent.toFixed(0)} 
          unit="RM" 
          icon={<Droplet className="w-6 h-6" />} 
          type="secondary"
        />
        <StatCard 
          title="Odometer +" 
          value={totalDistance.toFixed(0)} 
          unit="km" 
          icon={<Map className="w-6 h-6" />} 
          type="accent"
        />
        <StatCard 
          title="Range / RM" 
          value={avgKmRM} 
          unit="km" 
          icon={<TrendingUp className="w-6 h-6" />} 
          type="primary"
        />
      </div>

      {/* Main Chart */}
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-green-500 z-10"></div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-green-500 z-10"></div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-6 md:p-8 backdrop-blur shadow-[0_0_30px_rgba(0,0,0,0.5)] skew-fast">
          <div className="unskew-fast">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
              <TrendingUp className="w-6 h-6 text-green-500" />
              Efficiency <span className="text-green-500">Telemetry</span>
            </h3>
            
            <div className="h-[350px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#525252" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{fill: '#737373', fontWeight: 'bold', fontStyle: 'italic'}}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#525252" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{fill: '#737373', fontWeight: 'bold'}}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000000', 
                        borderColor: '#22c55e', 
                        color: '#ffffff',
                        borderWidth: '2px',
                        transform: 'skewX(-12deg)',
                        boxShadow: '0 0 10px rgba(34,197,94,0.3)'
                      }}
                      itemStyle={{ color: '#22c55e', fontWeight: 'bold', textTransform: 'uppercase' }}
                      labelStyle={{ color: '#a3a3a3', fontStyle: 'italic', marginBottom: '5px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#22c55e" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorEff)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-600">
                  <div className="text-4xl font-black italic uppercase mb-2">NO DATA</div>
                  <div className="text-sm tracking-widest uppercase">Start driving to log telemetry</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit, icon, type }: any) => {
  const getColors = () => {
    switch(type) {
      case 'primary': return 'border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]';
      case 'secondary': return 'border-pink-500 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.15)]';
      case 'accent': return 'border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
      default: return 'border-white text-white';
    }
  };

  const getBg = () => {
     switch(type) {
      case 'primary': return 'bg-green-500/5';
      case 'secondary': return 'bg-pink-500/5';
      case 'accent': return 'bg-cyan-500/5';
      default: return 'bg-neutral-900';
    }
  }

  return (
    <div className={`relative p-1 skew-fast ${getColors()}`}>
       <div className={`absolute inset-0 border-2 ${getColors()} opacity-50`}></div>
       <div className={`h-full ${getBg()} p-4 flex flex-col justify-between unskew-fast`}>
          <div className="flex justify-between items-start mb-2 opacity-80">
            <span className="text-xs font-black uppercase tracking-widest text-neutral-400">{title}</span>
            {icon}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-white drop-shadow-md">{value}</span>
            <span className="text-xs font-bold uppercase text-neutral-500">{unit}</span>
          </div>
          {/* Progress bar simulation */}
          <div className="w-full h-1 bg-neutral-800 mt-2 overflow-hidden">
             <div className={`h-full w-2/3 ${type === 'primary' ? 'bg-green-500' : type === 'secondary' ? 'bg-pink-500' : 'bg-cyan-500'}`}></div>
          </div>
       </div>
    </div>
  );
};

export default Dashboard;