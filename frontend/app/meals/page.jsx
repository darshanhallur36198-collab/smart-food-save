"use client";
import MealBooking from "@/components/Meal/MealBooking";
import MealCountdown from "@/components/Meal/MealCountdown";
import Sidebar from "@/components/Sidebar";

export default function Meals() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Active Meal Booking</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Reserve your meals so the system can predict ingredient usage accurately.</p>
          </header>

          <MealCountdown />
          <MealBooking />
        </div>
      </div>
    </div>
  );
}