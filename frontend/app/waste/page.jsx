"use client";
import WasteUpload from "@/components/Waste/WasteUpload";
import WasteAnalytics from "@/components/Charts/WasteAnalytics";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/components/AuthProvider";

export default function Waste() {
  const { user } = useAuth() || {};
  const isStudent = user?.role === "student";

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="mb-2">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Waste Management</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Log your daily excess and view reduction analytics across the system.</p>
          </header>

          <WasteAnalytics />
          
          {!isStudent ? (
            <WasteUpload />
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl text-center shadow-sm">
              <span className="text-xl mr-2">🔒</span>
              <strong>Permission Denied:</strong> Only staff and admins can log new waste.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}