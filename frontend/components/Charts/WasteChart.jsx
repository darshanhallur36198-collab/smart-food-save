"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { useEffect, useState } from "react";
import API from "@/services/api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function WasteChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/waste")
      .then(({ data }) => {
        if (!data || data.length === 0) {
          // Show placeholder if no data
          setChartData({
            labels: ["No data yet"],
            datasets: [{
              label: "Food Waste (kg)",
              data: [0],
              backgroundColor: "rgba(244, 63, 94, 0.4)",
              borderRadius: 6,
            }]
          });
          return;
        }

        // Group by date label (last 7 entries)
        const recent = data.slice(0, 7).reverse();
        const labels = recent.map((w, i) => {
          const d = new Date(w.createdAt || Date.now());
          return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
        });
        const weights = recent.map(w => w.weight || 0);

        setChartData({
          labels,
          datasets: [{
            label: "Food Waste (kg)",
            data: weights,
            backgroundColor: "rgba(244, 63, 94, 0.8)",
            borderRadius: 6,
          }]
        });
      })
      .catch(() => {
        setChartData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-slate-800 mb-1">Waste Analytics</h2>
      <p className="text-sm text-slate-500 mb-6">Recent waste logs from database</p>
      {loading && <p className="text-slate-400 text-sm">Loading data...</p>}
      {!loading && !chartData && <p className="text-red-400 text-sm">Failed to load data. Check backend.</p>}
      {!loading && chartData && <Bar data={chartData} options={options} />}
    </div>
  );
}