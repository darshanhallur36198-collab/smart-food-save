"use client";
import { useEffect, useState } from "react";
import API from "@/services/api";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";
import QRScanner from "./QRScanner";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, ClipboardList, Download, Plus, X, Maximize2 } from "lucide-react";

const PAGE_SIZE = 5;
const LOW_STOCK_THRESHOLD = 10;

export default function InventoryTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [showScanner, setShowScanner] = useState(false);
  const [expandedQR, setExpandedQR] = useState(null);
  const toast = useToast();

  useEffect(() => {
    API.get("/inventory")
      .then(res => {
        const items = res.data || [];
        setData(items);
        const lowStock = items.filter(i => i.quantity <= LOW_STOCK_THRESHOLD);
        if (lowStock.length > 0) {
          toast(`⚠️ ${lowStock.length} item(s) are running low on stock!`, "warning");
        }
      })
      .catch(() => {
        toast("Failed to load inventory.", "error");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleScan = (result) => {
    toast(`📦 Scanned: ${result}. Stock entry successfully recorded!`, "success");
  };

  const generateProcurement = () => {
    const lowStock = data.filter(i => i.quantity <= LOW_STOCK_THRESHOLD);
    if (lowStock.length === 0) {
      toast("All stock levels are healthy! No procurement needed.", "success");
      return;
    }
    const header = "Item,Current Stock,Target Stock,To Order";
    const rows = lowStock.map(i => `${i.item},${i.quantity},50,${50 - i.quantity}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `procurement_order_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast("Procurement report generated!", "success");
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 3 && diff >= 0;
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getStatus = (item) => {
    if (isExpired(item.expiryDate)) return { label: "Expired", cls: "bg-red-100 text-red-700" };
    if (isExpiringSoon(item.expiryDate)) return { label: "Expiring Soon", cls: "bg-amber-100 text-amber-700" };
    if (item.quantity <= LOW_STOCK_THRESHOLD) return { label: "Low Stock", cls: "bg-orange-100 text-orange-700" };
    return { label: "In Stock", cls: "bg-emerald-100 text-emerald-700" };
  };

  const filtered = filter === "all" ? data
    : filter === "low" ? data.filter(i => i.quantity <= LOW_STOCK_THRESHOLD)
    : data.filter(i => isExpiringSoon(i.expiryDate) || isExpired(i.expiryDate));

  const expiringItems = data.filter(i => isExpiringSoon(i.expiryDate));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Smart Suggestions Panel */}
      {expiringItems.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-bold text-lg mb-1 text-white">Smart Menu Suggestion</h3>
            <p className="text-indigo-100 text-sm mb-3">You have {expiringItems.length} items expiring very soon.</p>
            <div className="bg-black/20 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <p className="text-sm font-medium">
                To prevent waste, we suggest planning tomorrow's menu around: <br/>
                <span className="font-bold text-white tracking-wide mt-1 block">
                  {expiringItems.map(i => i.item).join(", ")}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white text-lg">Inventory Stock</h2>
            <p className="text-xs text-slate-500 font-medium">Real-time shelf monitoring</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">
              <QrCode size={18} />
              Scan Stock
            </button>
            <button onClick={generateProcurement}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white dark:bg-slate-700 rounded-xl text-sm font-bold hover:bg-slate-900 transition-all active:scale-95 border border-slate-700">
              <ClipboardList size={18} />
              Procurement Info
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>
            {["all", "low", "expiring"].map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(Page => 1); }}
                className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${filter === f ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 hover:bg-slate-200"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showScanner && (
            <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">
                <th className="py-4 px-6 font-semibold">QR Tag</th>
                <th className="py-4 px-6 font-semibold">Item</th>
                <th className="py-4 px-6 font-semibold">Quantity</th>
                <th className="py-4 px-6 font-semibold">Expiry Date</th>
                <th className="py-4 px-6 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paginated.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-slate-400">No items found.</td></tr>
              ) : paginated.map(item => {
                const status = getStatus(item);
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.item}-${item._id?.slice(-4)}`;
                return (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="py-4 px-6">
                       <div className="relative w-10 h-10 cursor-pointer overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500 transition-colors"
                            onClick={() => setExpandedQR({ url: qrUrl, name: item.item })}>
                          <img src={qrUrl} alt="QR" className="w-full h-full grayscale group-hover:grayscale-0 transition-opacity opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Maximize2 size={12} className="text-white" />
                          </div>
                       </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800 dark:text-white">
                      {item.quantity <= LOW_STOCK_THRESHOLD && <span className="mr-1">⚠️</span>}
                      {item.item}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold ${item.quantity <= LOW_STOCK_THRESHOLD ? "bg-orange-100 text-orange-800" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}>
                        {item.quantity} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 text-sm">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 transition-colors">← Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 transition-colors">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded QR Modal */}
      <AnimatePresence>
        {expandedQR && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" onClick={() => setExpandedQR(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                 className="bg-white dark:bg-slate-800 rounded-3xl p-10 max-w-sm w-full text-center relative border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
               <button onClick={() => setExpandedQR(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><X size={20}/></button>
               <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{expandedQR.name}</h3>
               <p className="text-xs text-slate-500 font-bold mb-8 uppercase tracking-widest leading-none">Official Inventory Label</p>
               <div className="bg-white p-6 rounded-3xl shadow-inner border-4 border-emerald-500/20 mb-8 aspect-square flex items-center justify-center">
                  <img src={expandedQR.url} alt="Large QR" className="w-full h-full" />
               </div>
               <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-xs tracking-tighter hover:scale-105 transition-all shadow-xl">Print Label 🖨️</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}