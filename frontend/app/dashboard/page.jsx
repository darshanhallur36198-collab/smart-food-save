"use client";
import Sidebar from "@/components/Sidebar";
import WasteChart from "@/components/Charts/WasteChart";
import DemandChart from "@/components/Charts/DemandChart";
import { useEffect, useState } from "react";
import socket from "@/services/socket";
import API from "@/services/api";
import { useToast } from "@/components/ToastProvider";
import CanteenInsights from "@/components/Dashboard/CanteenInsights";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalWaste: 0, totalLogs: 0, users: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const handleAlert = (msg) => {
      console.log("Socket Alert:", msg);
      toast(msg, "error"); // Pop a red toast for alerts
    };
    
    socket.on("alert", handleAlert);

    // Fetch live summary stats
    Promise.all([
      API.get("/waste").catch(() => ({ data: [] })),
    ]).then(([wasteRes]) => {
      const wasteLogs = wasteRes.data || [];
      const totalWaste = wasteLogs.reduce((sum, w) => sum + (w.weight || 0), 0);
      setStats({
        totalWaste: totalWaste.toFixed(1),
        totalLogs: wasteLogs.length,
      });
    }).finally(() => setLoadingStats(false));

    return () => socket.off("alert");
  }, []);

  const statCards = [
    { label: "Total Waste Logged", value: loadingStats ? "..." : `${stats.totalWaste} kg`, icon: "🗑️", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-900/30" },
    { label: "Waste Log Entries", value: loadingStats ? "..." : stats.totalLogs, icon: "📋", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-100 dark:border-orange-900/30" },
    { label: "System Status", value: "Online", icon: "✅", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-900/30" },
    { label: "Backend", value: "Connected", icon: "🔗", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-900/20", border: "border-teal-100 dark:border-teal-900/30" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />

      <div className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">System Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Live overview of food demand and waste analytics</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
          {statCards.map((card) => (
            <div key={card.label} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4`}>
              <div className={`${card.bg} border ${card.border} rounded-xl p-3 text-2xl`}>{card.icon}</div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase mb-1">{card.label}</p>
                <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="dark:bg-slate-800 rounded-2xl">
                <WasteChart />
              </div>
              <div className="dark:bg-slate-800 rounded-2xl">
                <DemandChart />
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">System Logistics Overview</h3>
               <p className="text-sm text-slate-500 mb-6">Automated monitoring of waste reduction targets and inventory procurement needs.</p>
               <div className="h-48 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center italic text-slate-400">
                  Detailed Logistics Visualization coming in v2
               </div>
            </div>
          </div>

          <div className="xl:col-span-1">
             <CanteenInsights stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}