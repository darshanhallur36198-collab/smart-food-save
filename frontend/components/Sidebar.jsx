"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Utensils, 
  Package, 
  Trash2, 
  Handshake, 
  Map as MapIcon, 
  User as UserIcon,
  LogOut,
  ChevronRight,
  ChefHat,
  BarChart3,
  Shield
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth() || {};
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isStudent = user?.role === "student";

  const handleLogout = () => {
    if (logout) logout();
    else {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const isAuthenticated = mounted && !!user;

  return (
    <div className="w-64 min-h-[calc(100vh-64px)] bg-slate-900 dark:bg-slate-950 border-r border-slate-800 text-slate-300 p-6 flex flex-col shadow-2xl">
      <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">Navigation</h2>

      <ul className="space-y-2 flex-grow">
        <SidebarLink href="/dashboard" icon={LayoutDashboard} text="Dashboard" active={pathname === "/dashboard"} />
        <SidebarLink href="/meals" icon={Utensils} text="Meals" active={pathname === "/meals"} />
        {!isStudent && <SidebarLink href="/inventory" icon={Package} text="Inventory" active={pathname === "/inventory"} />}
        <SidebarLink href="/waste" icon={Trash2} text="Waste Tracker" active={pathname === "/waste"} />
        <SidebarLink href="/donations" icon={Handshake} text="Donations" active={pathname === "/donations"} />
        <SidebarLink href="/map" icon={MapIcon} text="Live Map" active={pathname === "/map"} />
        {isAuthenticated && (
          <SidebarLink href="/profile" icon={UserIcon} text="My Profile" active={pathname === "/profile"} />
        )}

        {!isStudent && (
          <>
            <li className="pt-4 pb-1">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Staff Zone</p>
            </li>
            <SidebarLink href="/menu-planner" icon={ChefHat} text="Menu Planner" active={pathname === "/menu-planner"} />
            <SidebarLink href="/staff-reports" icon={BarChart3} text="Staff Reports" active={pathname === "/staff-reports"} />
            {user?.role === "admin" && (
              <SidebarLink href="/admin" icon={Shield} text="Admin Panel" active={pathname === "/admin"} />
            )}
          </>
        )}
      </ul>

      <div className="mt-auto pt-8 border-t border-slate-800">
        {isAuthenticated ? (
          <div className="space-y-4">
            <motion.div 
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-slate-800/40 border border-slate-800/50"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20">
                  {user.role?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm"></div>
              </div>
              <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                <p className="font-bold text-white capitalize leading-tight">{user.role} User</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Active Session</p>
              </div>
            </motion.div>
            
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 font-bold group border border-rose-500/20"
            >
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Link href="/login"
              className="w-full text-center text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
              Log in
            </Link>
            <Link href="/register"
              className="w-full text-center text-sm font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 px-4 py-3 rounded-xl transition-all border border-slate-700 active:scale-95">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarLink({ href, icon: Icon, text, active }) {
  return (
    <li>
      <Link href={href}>
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
            active 
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" 
              : "hover:bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={false}
              animate={{ rotate: active ? [0, -10, 10, 0] : 0 }}
              transition={{ repeat: active ? Infinity : 0, duration: 2, repeatDelay: 5 }}
              className={`${active ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400"} transition-colors`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            </motion.div>
            <span className={`text-sm font-bold tracking-tight ${active ? "text-white" : ""}`}>{text}</span>
          </div>
          
          {active && (
            <motion.div
              layoutId="activeIndicator"
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />
          )}

          {!active && (
            <ChevronRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          )}
        </motion.div>
      </Link>
    </li>
  );
}