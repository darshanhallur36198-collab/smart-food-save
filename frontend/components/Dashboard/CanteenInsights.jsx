"use client";
import { DollarSign, TrendingUp, Trophy, ChefHat, Users, ListChecks } from "lucide-react";
import { motion } from "framer-motion";

export default function CanteenInsights({ stats = {} }) {
  const savings = (stats.totalWaste * 0.12).toFixed(2); // Mock savings calculation
  const totalBookings = 142; // Mock bookings

  const leaderboard = [
    { rank: 1, name: "Anita S.", points: 1240, badge: "Master Chef" },
    { rank: 2, name: "Rajesh K.", points: 1150, badge: "Waste Warrior" },
    { rank: 3, name: "Prathap V.", points: 980, badge: "Eco Guard" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      {/* Financial & Demand Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp size={20} />
              Demand Forecast
            </h3>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase">Live</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-center flex-1">
                <p className="text-[10px] uppercase font-black text-indigo-100 mb-1 tracking-widest">Today's Bookings</p>
                <p className="text-3xl font-black">{totalBookings}</p>
              </div>
              <div className="w-px h-8 bg-white/20 mx-4"></div>
              <div className="text-center flex-1">
                <p className="text-[10px] uppercase font-black text-indigo-100 mb-1 tracking-widest">Raw Mat. Prep</p>
                <p className="text-3xl font-black">{(totalBookings * 0.4).toFixed(0)} kg</p>
              </div>
            </div>
            <p className="text-xs text-indigo-100 italic">"Suggested prep reduction: -12% based on current bookings."</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <DollarSign size={20} />
              Financial Impact
            </h3>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase">Metrics</span>
          </div>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-4xl font-black mb-1">${savings || "4.50"}</p>
              <p className="text-sm font-bold text-emerald-100 uppercase tracking-widest leading-tight">Est. Monthly Savings <br/> from Waste Reduction</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-100">Peak Pattern: 1-2 PM</span>
              <div className="px-2 py-1 bg-white text-emerald-700 rounded-lg text-[10px] font-black uppercase">High Efficiency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10">
          <Trophy size={80} className="transform rotate-12" />
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              Staff Gamified Leaderboard
            </h3>
            <p className="text-xs text-slate-500 font-medium tracking-tight">Top-performing cafeteria staff on waste reduction targets</p>
          </div>
          <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline p-1">View All</button>
        </div>

        <div className="space-y-3">
          {leaderboard.map((staff, i) => (
            <motion.div 
              key={staff.name} 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-default group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  staff.rank === 1 ? "bg-amber-100 text-amber-600" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {staff.rank}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-white capitalize">{staff.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ChefHat size={10} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{staff.badge}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{staff.points} pts</p>
                <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                   <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(staff.points/1300)*100}%` }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
