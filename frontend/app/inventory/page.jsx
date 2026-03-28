"use client";
import InventoryTable from "@/components/Inventory/InventoryTable";
import Sidebar from "@/components/Sidebar";

export default function Inventory() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Pantry & Inventory</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage stock levels and track ingredient expiry dates</p>
        </header>
        
        <InventoryTable />
      </div>
      </div>
    </div>
  );
}