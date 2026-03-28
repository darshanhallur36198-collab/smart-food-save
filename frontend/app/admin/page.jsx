"use client";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Trash2, UserCheck, UserX, Mail, BadgeAlert } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

const mockUsers = [
  { id: 1, name: "Anita S.", email: "anita@college.edu", role: "staff", status: "active" },
  { id: 2, name: "Rajesh K.", email: "rajesh@admin.edu", role: "admin", status: "active" },
  { id: 3, name: "Priya M.", email: "priya@student.edu", role: "student", status: "active" },
  { id: 4, name: "Vikram D.", email: "vikram@student.edu", role: "student", status: "suspended" },
  { id: 5, name: "Nandini V.", email: "nandini@college.edu", role: "staff", status: "active" },
];

const roleColors = {
  admin: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
  staff: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  student: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400",
};

export default function AdminPanelPage() {
  const { user } = useAuth() || {};
  const router = useRouter();
  const toast = useToast();
  const [users, setUsers] = useState(mockUsers);

  useEffect(() => {
    if (user && user.role !== "admin") router.push("/dashboard");
  }, [user]);

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
    toast("User status updated.", "success");
  };

  const sendNotice = (name) => {
    toast(`📧 Notice sent to ${name}!`, "success");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl shadow-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={100} /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Shield size={22} /></div>
            <h1 className="text-2xl font-black">Admin Panel</h1>
          </div>
          <p className="text-violet-100 text-sm font-medium max-w-lg">Manage system users, roles, and send notices. Available to Campus Administrators only.</p>
          <div className="flex items-center gap-4 mt-5">
            {[
              { label: "Total Users", val: users.length },
              { label: "Active", val: users.filter(u => u.status === "active").length },
              { label: "Suspended", val: users.filter(u => u.status === "suspended").length },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl px-6 py-3 text-center border border-white/10">
                <p className="text-2xl font-black">{s.val}</p>
                <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-violet-500" /> System Users
          </h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {users.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-500/20">
                  {u.name[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${roleColors[u.role]}`}>
                  {u.role}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"}`}>
                  {u.status}
                </span>

                <div className="flex items-center gap-1.5">
                  <button onClick={() => sendNotice(u.name)} title="Send Notice"
                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 transition-colors">
                    <Mail size={15} />
                  </button>
                  <button onClick={() => toggleStatus(u.id)} title={u.status === "active" ? "Suspend" : "Activate"}
                    className={`p-2 rounded-lg transition-colors ${u.status === "active" ? "hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" : "hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-500"}`}>
                    {u.status === "active" ? <UserX size={15} /> : <UserCheck size={15} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
