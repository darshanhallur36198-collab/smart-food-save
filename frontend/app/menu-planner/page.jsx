"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChefHat, Plus, Trash2, CalendarCheck, Info } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

const defaultMenu = {
  Monday: { Breakfast: "Idli & Sambar", Lunch: "Rice + Dal + Sabji", Dinner: "Chapati + Paneer" },
  Tuesday: { Breakfast: "Poha + Tea", Lunch: "Wheat Roti + Mix Veg", Dinner: "Fried Rice + Manchurian" },
  Wednesday: { Breakfast: "Bread & Egg", Lunch: "Rice + Fish Curry", Dinner: "Roti + Dal Makhani" },
  Thursday: { Breakfast: "Upma + Coffee", Lunch: "Biryani + Raita", Dinner: "Chapati + Chana Masala" },
  Friday: { Breakfast: "Dosa + Chutney", Lunch: "Rice + Rasam + Papad", Dinner: "Puri + Sabji" },
  Saturday: { Breakfast: "Paratha + Curd", Lunch: "Special Meals", Dinner: "Pulao + Salad" },
};

export default function MenuPlannerPage() {
  const { user } = useAuth() || {};
  const router = useRouter();
  const toast = useToast();
  const [menu, setMenu] = useState(defaultMenu);
  const [editing, setEditing] = useState(null); // { day, meal }
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (user && user.role === "student") {
      router.push("/dashboard");
    }
  }, [user]);

  const startEdit = (day, meal) => {
    setEditing({ day, meal });
    setEditValue(menu[day][meal]);
  };

  const saveEdit = () => {
    if (!editValue.trim()) return;
    setMenu(prev => ({
      ...prev,
      [editing.day]: { ...prev[editing.day], [editing.meal]: editValue }
    }));
    toast(`✅ ${editing.day} ${editing.meal} updated!`, "success");
    setEditing(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><ChefHat size={100} /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><ChefHat size={22} /></div>
            <h1 className="text-2xl font-black">Weekly Menu Planner</h1>
          </div>
          <p className="text-orange-100 font-medium text-sm max-w-lg">Plan and update the weekly canteen menu. Students see this as their meal reference. Click any cell to edit it.</p>
          <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-xl px-4 py-2 w-fit border border-white/10">
            <Info size={14} />
            <p className="text-[11px] font-bold uppercase tracking-widest">Staff & Admin Only</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Day</th>
                {MEALS.map(m => (
                  <th key={m} className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {DAYS.map((day, i) => (
                <motion.tr key={day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="py-4 px-6 font-black text-slate-800 dark:text-white text-sm">{day}</td>
                  {MEALS.map(meal => (
                    <td key={meal} className="py-4 px-6">
                      {editing?.day === day && editing?.meal === meal ? (
                        <div className="flex gap-2">
                          <input autoFocus value={editValue} onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && saveEdit()}
                            className="flex-1 px-3 py-1.5 text-sm border-2 border-amber-500 rounded-lg bg-amber-50 dark:bg-slate-900 dark:text-white focus:outline-none font-medium" />
                          <button onClick={saveEdit} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-black hover:bg-amber-600 transition-colors">Save</button>
                        </div>
                      ) : (
                        <div onClick={() => startEdit(day, meal)}
                          className="flex items-center gap-2 group cursor-pointer px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-200 dark:hover:border-amber-500/20">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">{menu[day][meal]}</span>
                          <span className="text-[10px] font-black text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase">Edit</span>
                        </div>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button onClick={() => toast("📋 Menu published to all canteen screens!", "success")}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95">
            <CalendarCheck size={18} /> Publish Menu
          </button>
        </div>
      </div>
    </div>
  );
}
