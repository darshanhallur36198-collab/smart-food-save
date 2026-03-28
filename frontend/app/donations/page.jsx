"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/components/ToastProvider";
import Skeleton from "@/components/Skeleton";
import MapWrapper from "@/components/Map/MapWrapper";
import { Handshake } from "lucide-react";

export default function Donations() {
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("Main Campus");
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [useLocation, setUseLocation] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [expandedMap, setExpandedMap] = useState(null);
  const toast = useToast();

  const fetchDonations = () => {
    API.get("/donation")
      .then(res => setDonations(res.data || []))
      .catch(() => toast("Failed to load donation board", "error"))
      .finally(() => setFetching(false));
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount) return;
    setLoading(true);
    try {
      await API.post("/donation/create", { foodAmount: amount, location, coordinates });
      toast("Donation successfully recorded!", "success");
      setAmount("");
      fetchDonations();
    } catch (err) {
      toast("Failed to process donation.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, ngoName = null) => {
    try {
      await API.put(`/donation/${id}`, { status, ngoName });
      toast(`Donation status updated to ${status}`, "success");
      fetchDonations();
    } catch (err) {
      toast("Failed to update status", "error");
    }
  };

  const columns = ["Pending", "Assigned", "Picked Up", "Delivered"];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto space-y-10">
          <header>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Food Donation Network</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Distribute safe excess food to NGOs and track the delivery lifecycle.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-emerald-500 p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm text-3xl shadow-inner">🍲</div>
                <h2 className="text-xl font-bold">Donate Surplus</h2>
              </div>
              <form onSubmit={handleDonate} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Food Quantity (kg)</label>
                  <input type="number" required min="1" value={amount}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 dark:bg-slate-900 font-medium dark:text-white"
                    placeholder="e.g. 15" onChange={e => setAmount(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Pickup Location</label>
                  <select value={location} onChange={e => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 dark:bg-slate-900 font-medium dark:text-white">
                    <option value="Main Campus">Main Campus Cafeteria</option>
                    <option value="North Wing">North Wing Dining</option>
                    <option value="East Hostel">East Hostel Mess</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                   <input type="checkbox" id="geoloc" checked={useLocation} onChange={e => {
                      if (e.target.checked) {
                        setUseLocation(true);
                        if ("geolocation" in navigator) {
                          navigator.geolocation.getCurrentPosition(
                            pos => { setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude }); toast("Location captured!", "info"); },
                            err => { toast("Please allow Location access to tag waste.", "warning"); setUseLocation(false); }
                          );
                        }
                      } else { setUseLocation(false); setCoordinates(null); }
                   }} className="w-4 h-4 text-emerald-600 rounded bg-slate-100 border-slate-300 focus:ring-emerald-500" />
                   <label htmlFor="geoloc" className="text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                     Attach GPS Geotag 📍
                   </label>
                </div>
                {coordinates && (
                  <div className="w-full mt-2 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">GPS Attached 📍</p>
                       <button type="button" onClick={() => { setUseLocation(false); setCoordinates(null); }} className="text-[10px] font-bold text-rose-500 hover:underline">Remove</button>
                    </div>
                    <div className="h-[150px] w-full relative z-0 rounded-xl overflow-hidden border-2 border-emerald-500/20 shadow-inner">
                      <MapWrapper lat={coordinates.lat} lng={coordinates.lng} popupText="Donation Pickup" />
                    </div>
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">Processing...</span>
                  ) : (
                    <>
                      <Handshake size={20} />
                      Submit Donation
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Kanban Board */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">📍 Live Tracking Board</h3>
              
              {fetching ? (
                <div className="flex gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="flex-1"><Skeleton className="h-[400px] w-full" /></div>)}
                </div>
              ) : (
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                  {columns.map(col => {
                    const items = donations.filter(d => d.status === col);
                    return (
                      <div key={col} className="min-w-[280px] flex-1 flex flex-col snap-start">
                        <div className="bg-slate-200 dark:bg-slate-800 rounded-t-xl px-4 py-3 font-bold text-slate-700 dark:text-slate-300 text-sm flex justify-between">
                          {col} <span className="bg-slate-300 dark:bg-slate-700 px-2 rounded-full text-xs">{items.length}</span>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800/50 flex-1 p-3 rounded-b-xl min-h-[400px] space-y-3">
                          {items.map(req => (
                            <div key={req._id} className="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-black text-emerald-600 dark:text-emerald-400">{req.foodAmount} kg</span>
                                <span className="text-[10px] text-slate-400 font-medium uppercase">{new Date(req.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-4 py-1 flex items-center gap-1">
                                <span>📍 {req.location}</span>
                                {req.coordinates?.lat && (
                                  <button onClick={() => setExpandedMap(expandedMap === req._id ? null : req._id)} title="View Interactive Map" className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 hover:scale-110 transition-all">🗺️</button>
                                )}
                              </p>
                              
                              {expandedMap === req._id && req.coordinates && (
                                <div className="w-full h-[200px] mb-4 z-0 rounded-lg overflow-hidden shadow-inner border border-slate-200 dark:border-slate-600">
                                  <MapWrapper lat={req.coordinates.lat} lng={req.coordinates.lng} popupText={`${req.foodAmount}kg - ${req.location}`} />
                                </div>
                              )}

                              {col === "Pending" && (
                                <button onClick={() => updateStatus(req._id, "Assigned", "City Food Bank")} className="w-full text-xs font-bold py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors">Assign to NGO</button>
                              )}
                              {col === "Assigned" && (
                                <button onClick={() => updateStatus(req._id, "Picked Up")} className="w-full text-xs font-bold py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors">Mark Picked Up</button>
                              )}
                              {col === "Picked Up" && (
                                <button onClick={() => updateStatus(req._id, "Delivered")} className="w-full text-xs font-bold py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors">Mark Delivered</button>
                              )}
                              {col === "Delivered" && (
                                <span className="block text-center w-full text-xs font-bold py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg">✅ Completed</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}