"use client";
import { useAuth } from "@/components/AuthProvider";
import { useDarkMode } from "@/components/DarkModeProvider";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuth() || {};
  const darkMode = useDarkMode();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  if (!user) return null;

  const roleColor = {
    admin: "bg-purple-100 text-purple-700",
    staff: "bg-blue-100 text-blue-700",
    student: "bg-emerald-100 text-emerald-700",
  };

  const rolePerms = {
    admin: ["View all data", "Manage users", "Delete records", "Access all routes"],
    staff: ["Log waste", "Manage inventory", "Create meals", "Submit donations"],
    student: ["Book meals", "View dashboard", "View donations"],
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Profile</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Your account information and permissions</p>
          </header>

          {/* Avatar card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {user.role?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white capitalize">{user.role} User</p>
              <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${roleColor[user.role] || "bg-slate-100 text-slate-700"}`}>
                {user.role?.toUpperCase()}
              </span>
              <p className="text-xs text-slate-400 mt-2 font-mono">ID: {user.id}</p>
            </div>
          </div>

          {/* Permissions card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-6">
            <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-lg">🔐 Your Permissions</h2>
            <ul className="space-y-2">
              {(rolePerms[user.role] || []).map(perm => (
                <li key={perm} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                  <span className="text-emerald-500">✓</span> {perm}
                </li>
              ))}
            </ul>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-6">
            <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-4 text-lg">⚙️ Preferences</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</p>
                <p className="text-xs text-slate-400">Toggle the interface theme</p>
              </div>
              <button
                onClick={darkMode?.toggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${darkMode?.dark ? "bg-emerald-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode?.dark ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
