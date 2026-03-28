"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import Sidebar from "@/components/Sidebar";
import MapWrapper from "@/components/Map/MapWrapper";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";

export default function GlobalMapPage() {
  const [markers, setMarkers] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // 1. Start Live GPS Tracking
    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserPos({ lat: latitude, lng: longitude });
        },
        () => {
          toast("Location tracking disabled. Please allow access.", "warning");
        },
        { enableHighAccuracy: true }
      );
    }

    const fetchData = async () => {
      try {
        const [wasteRes, donationRes] = await Promise.all([
          API.get("/waste"),
          API.get("/donation")
        ]);

        const wasteMarkers = (wasteRes.data || [])
          .filter(w => w.coordinates && w.coordinates.lat && w.coordinates.lng)
          .map(w => ({
            lat: w.coordinates.lat,
            lng: w.coordinates.lng,
            type: 'waste',
            popupText: `Waste: ${w.weight}kg ${w.type}`,
            details: `Logged on ${new Date(w.createdAt || w.date).toLocaleDateString()}`
          }));

        const donationMarkers = (donationRes.data || [])
          .filter(d => d.coordinates && d.coordinates.lat && d.coordinates.lng)
          .map(d => ({
            lat: d.coordinates.lat,
            lng: d.coordinates.lng,
            type: 'donation',
            popupText: `Donation: ${d.foodAmount}kg`,
            details: `Status: ${d.status} (${d.location})`
          }));

        setMarkers([...wasteMarkers, ...donationMarkers]);
      } catch (err) {
        toast("Failed to load map data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup watcher on unmount
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [toast]);

  // Combine fetched markers with live user position
  const allMarkers = userPos ? [
    { 
      lat: userPos.lat, 
      lng: userPos.lng, 
      type: 'user', 
      popupText: "🏠 You Are Here", 
      details: "Current Tracking Active" 
    }, 
    ...markers
  ] : markers;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Global Geotag Map</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Real-time geographical visualization of food waste and donations.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">My Position</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Waste</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Donations</span>
              </div>
            </div>
          </header>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden h-[650px] relative">
            {loading ? (
              <div className="h-full w-full p-8 space-y-4">
                <Skeleton className="h-full w-full rounded-2xl" />
              </div>
            ) : (
              <MapWrapper markers={allMarkers} lat={userPos?.lat} lng={userPos?.lng} />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/40">
              <h4 className="text-rose-900 dark:text-rose-300 font-bold mb-1">Waste Hotspots</h4>
              <p className="text-rose-700 dark:text-rose-400 text-sm">Visualize where most food waste is occurring to optimize supply chains.</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
              <h4 className="text-emerald-900 dark:text-emerald-300 font-bold mb-1">Donation Points</h4>
              <p className="text-emerald-700 dark:text-emerald-400 text-sm">Real-time pickup locations for NGOs and local charities.</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/40">
              <h4 className="text-blue-900 dark:text-blue-300 font-bold mb-1">Precision Logistics</h4>
              <p className="text-blue-700 dark:text-blue-400 text-sm">Optimizing routes for food recovery with exact GPS coordinates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
