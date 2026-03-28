"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import Sidebar from "@/components/Sidebar";
import MapWrapper from "@/components/Map/MapWrapper";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Building2, Navigation } from "lucide-react";

// Kerala & Karnataka NGOs with real coordinates
const NGO_DATA = [
  // Kerala NGOs
  { name: "Akshaya Patra Foundation", city: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366, phone: "+91-471-2345678", email: "info@akshayapatra.org", type: "Food Distribution" },
  { name: "Helping Hands Kerala", city: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, phone: "+91-484-2345678", email: "helpinghandskerala@gmail.com", type: "Food Rescue" },
  { name: "Food for Life Kozhikode", city: "Kozhikode", state: "Kerala", lat: 11.2588, lng: 75.7804, phone: "+91-495-2345678", email: "ffl.kozhikode@gmail.com", type: "Community Kitchen" },
  { name: "Snehapoorvam Trust", city: "Thrissur", state: "Kerala", lat: 10.5276, lng: 76.2144, phone: "+91-487-2345678", email: "snehapoorvam@gmail.com", type: "Food Bank" },
  { name: "Green Kerala NGO", city: "Kollam", state: "Kerala", lat: 8.8932, lng: 76.6141, phone: "+91-474-2345678", email: "greenkerala@ngo.org", type: "Waste Reduction" },
  { name: "Amma Canteen Support", city: "Palakkad", state: "Kerala", lat: 10.7867, lng: 76.6548, phone: "+91-491-2345678", email: "ammacanteen@gmail.com", type: "Food Distribution" },
  { name: "Nava Kerala Foundation", city: "Malappuram", state: "Kerala", lat: 11.0510, lng: 76.0711, phone: "+91-483-2345678", email: "navakeralafoundation@gmail.com", type: "Community Support" },
  { name: "Lokodaya Charitable Trust", city: "Kannur", state: "Kerala", lat: 11.8745, lng: 75.3704, phone: "+91-497-2345678", email: "lokodaya@charitable.org", type: "Food Bank" },

  // Karnataka NGOs
  { name: "Akshaya Patra Bangalore", city: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, phone: "+91-80-30143400", email: "bangalore@akshayapatra.org", type: "Food Distribution" },
  { name: "Robin Hood Army Bangalore", city: "Bengaluru", state: "Karnataka", lat: 12.9352, lng: 77.6245, phone: "+91-98860-00001", email: "bangalore@robinhoodarmy.com", type: "Food Rescue" },
  { name: "Goonj Karnataka", city: "Bengaluru", state: "Karnataka", lat: 12.9800, lng: 77.5880, phone: "+91-80-23638935", email: "karnataka@goonj.org", type: "Community Support" },
  { name: "Dharwad Food Bank", city: "Dharwad", state: "Karnataka", lat: 15.4589, lng: 75.0078, phone: "+91-836-2345678", email: "dharwadfoodbank@gmail.com", type: "Food Bank" },
  { name: "Mysuru Annadaana Trust", city: "Mysuru", state: "Karnataka", lat: 12.2958, lng: 76.6394, phone: "+91-821-2345678", email: "annadaana.mysuru@gmail.com", type: "Community Kitchen" },
  { name: "Hubli Hunger Free Initiative", city: "Hubballi", state: "Karnataka", lat: 15.3647, lng: 75.1240, phone: "+91-836-2987654", email: "hungerfree.hubli@gmail.com", type: "Food Distribution" },
  { name: "Mangaluru Food Relief", city: "Mangaluru", state: "Karnataka", lat: 12.9141, lng: 74.8560, phone: "+91-824-2345678", email: "foodrelief.mangaluru@gmail.com", type: "Food Rescue" },
  { name: "Belagavi Community Kitchen", city: "Belagavi", state: "Karnataka", lat: 15.8497, lng: 74.4977, phone: "+91-831-2345678", email: "ck.belagavi@ngo.org", type: "Community Kitchen" },
];

// Haversine formula to calculate distance between two coordinates in km
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function GlobalMapPage() {
  const [markers, setMarkers] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const toast = useToast();

  useEffect(() => {
    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserPos({ lat: latitude, lng: longitude });

          // Calculate distance for each NGO and filter within 60km
          const withDistance = NGO_DATA.map(ngo => ({
            ...ngo,
            distance: parseFloat(getDistanceKm(latitude, longitude, ngo.lat, ngo.lng))
          })).filter(ngo => ngo.distance <= 60)
            .sort((a, b) => a.distance - b.distance);

          setNearbyNGOs(withDistance);
        },
        () => {
          toast("Location access denied. Showing all NGOs.", "warning");
          // If no GPS, show all NGOs with no distance
          setNearbyNGOs(NGO_DATA.map(n => ({ ...n, distance: null })));
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
          .filter(w => w.coordinates?.lat && w.coordinates?.lng)
          .map(w => ({ lat: w.coordinates.lat, lng: w.coordinates.lng, type: 'waste', popupText: `Waste: ${w.weight}kg ${w.type}`, details: `Logged on ${new Date(w.createdAt || w.date).toLocaleDateString()}` }));

        const donationMarkers = (donationRes.data || [])
          .filter(d => d.coordinates?.lat && d.coordinates?.lng)
          .map(d => ({ lat: d.coordinates.lat, lng: d.coordinates.lng, type: 'donation', popupText: `Donation: ${d.foodAmount}kg`, details: `Status: ${d.status} (${d.location})` }));

        // Add all NGOs as purple markers on the map
        const ngoMarkers = NGO_DATA.map(ngo => ({
          lat: ngo.lat,
          lng: ngo.lng,
          type: 'ngo',
          popupText: `🤝 ${ngo.name}`,
          details: `${ngo.type} | ${ngo.city} | ${ngo.phone}`
        }));

        setMarkers([...wasteMarkers, ...donationMarkers, ...ngoMarkers]);
      } catch (err) {
        toast("Failed to load map data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [toast]);

  const allMarkers = userPos ? [
    { lat: userPos.lat, lng: userPos.lng, type: 'user', popupText: "🏠 You Are Here", details: "Current Location" },
    ...markers
  ] : markers;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Global Geotag Map</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time waste, donations & nearby NGOs within 60km</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { color: "bg-blue-500", label: "My Position" },
                { color: "bg-red-500", label: "Waste" },
                { color: "bg-green-500", label: "Donations" },
                { color: "bg-purple-500", label: "NGOs" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${l.color} shadow-lg`}></span>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{l.label}</span>
                </div>
              ))}
            </div>
          </header>

          {/* Map */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden h-[500px] relative">
            {loading ? (
              <div className="h-full w-full p-8"><Skeleton className="h-full w-full rounded-2xl" /></div>
            ) : (
              <MapWrapper markers={allMarkers} lat={userPos?.lat} lng={userPos?.lng} />
            )}
          </div>

          {/* Nearby NGOs Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Building2 size={20} className="text-purple-500" />
                  Nearby NGOs
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {userPos ? `${nearbyNGOs.length} partner NGOs within 60km of your location` : "All partner NGOs (enable location to see distances)"}
                </p>
              </div>
              {!userPos && (
                <div className="text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-3 py-2 rounded-xl font-bold">
                  📍 Enable GPS to filter by distance
                </div>
              )}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {(nearbyNGOs.length > 0 ? nearbyNGOs : NGO_DATA.map(n => ({ ...n, distance: null }))).map((ngo, i) => (
                <motion.div key={ngo.name}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <Building2 size={22} className="text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 dark:text-white text-sm">{ngo.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin size={11} className="text-slate-400" />
                          <span className="text-xs text-slate-500 font-medium">{ngo.city}, {ngo.state}</span>
                          <span className="text-[10px] mx-1 text-slate-400">•</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider
                            bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400">{ngo.type}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            ngo.state === "Karnataka"
                              ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
                              : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                          }`}>{ngo.state}</span>
                        </div>
                        <div className="flex gap-4 mt-3">
                          <a href={`tel:${ngo.phone}`} className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                            <Phone size={12} /> {ngo.phone}
                          </a>
                          <a href={`mailto:${ngo.email}`} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                            <Mail size={12} /> {ngo.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      {ngo.distance !== null ? (
                        <>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm ${ngo.distance <= 20 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : ngo.distance <= 40 ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
                            <Navigation size={14} />
                            {ngo.distance} km
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{ngo.distance <= 20 ? "Very Close" : ngo.distance <= 40 ? "Nearby" : "Reachable"}</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Location unavailable</span>
                      )}
                      <a href={`https://www.google.com/maps/search/?api=1&query=${ngo.lat},${ngo.lng}`} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] font-black text-purple-600 dark:text-purple-400 hover:underline uppercase tracking-widest">
                        <MapPin size={10} /> View on Google Maps
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
              {userPos && nearbyNGOs.length === 0 && (
                <div className="p-12 text-center text-slate-400 font-medium">
                  <Building2 size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No NGOs found within 60km of your current location.</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/40">
              <h4 className="text-rose-900 dark:text-rose-300 font-bold mb-1">Waste Hotspots</h4>
              <p className="text-rose-700 dark:text-rose-400 text-sm">Visualize where most food waste is occurring to optimize supply chains.</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
              <h4 className="text-emerald-900 dark:text-emerald-300 font-bold mb-1">Donation Points</h4>
              <p className="text-emerald-700 dark:text-emerald-400 text-sm">Real-time pickup locations for NGOs and local charities.</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/40">
              <h4 className="text-purple-900 dark:text-purple-300 font-bold mb-1">Partner NGOs</h4>
              <p className="text-purple-700 dark:text-purple-400 text-sm">Green-coded NGO partners filtered within 60km with direct contact links.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
