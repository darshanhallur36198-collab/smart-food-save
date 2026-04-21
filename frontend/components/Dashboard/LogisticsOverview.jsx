"use client";
import { useEffect, useState } from "react";
import API from "@/services/api";
import { Package, Handshake, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LogisticsOverview() {
  const [data, setData] = useState({ inventory: [], donations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/inventory").catch(() => ({ data: [] })),
      API.get("/donation").catch(() => ({ data: [] })),
    ]).then(([invRes, donRes]) => {
      setData({
        inventory: invRes.data || [],
        donations: donRes.data || [],
      });
    }).finally(() => setLoading(false));
  }, []);

  const lowStock = data.inventory.filter(item => item.quantity < 10);
  const pendingDonations = data.donations.filter(d => d.status === "Pending");

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-400 animate-pulse">
        Fetching logistics data...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Inventory Status */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
            <Package size={18} className="text-emerald-500" />
            Stock Levels
          </div>
          {lowStock.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
            <AlertCircle size={10} /> {lowStock.length} Alerts
            </span>
          )}
        </div>
        
        <div className="space-y-3">
          {data.inventory.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">{item.item}</span>
              <div className="flex items-center gap-3 flex-1 mx-4">
                <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.quantity < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(item.quantity * 2, 100)}%` }}
                  ></div>
                </div>
                <span className={`text-[10px] font-black min-w-[20px] ${item.quantity < 10 ? 'text-rose-500' : 'text-slate-500'}`}>
                  {item.quantity}
                </span>
              </div>
            </div>
          ))}
          {data.inventory.length === 0 && <p className="text-[10px] text-slate-400 italic">No inventory tracked yet.</p>}
        </div>
      </motion.div>

      {/* Donation Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
            <Handshake size={18} className="text-teal-500" />
            Recent Donations
          </div>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
            {pendingDonations.length} Pending
          </span>
        </div>

        <div className="space-y-4">
          {data.donations.slice(0, 3).map((donation, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className={`mt-1 p-1 rounded-lg ${donation.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {donation.status === 'Pending' ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{donation.foodAmount}kg to {donation.location}</p>
                  <span className="text-[9px] text-slate-400">{new Date(donation.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-[10px] text-slate-500 capitalize">{donation.status} • {donation.ngoName || 'Awaiting NGO'}</p>
              </div>
            </div>
          ))}
          {data.donations.length === 0 && <p className="text-[10px] text-slate-400 italic">No donations recorded yet.</p>}
        </div>
      </motion.div>
    </div>
  );
}
