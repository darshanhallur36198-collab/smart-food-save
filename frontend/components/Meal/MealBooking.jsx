import { useState } from "react";
import API from "@/services/api";

export default function MealBooking() {
  const [mealType, setMealType] = useState("Lunch");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const bookMeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/meals/register", {
        userId: "507f1f77bcf86cd799439011", // Valid MongoDB ObjectId placeholder
        mealId: mealType, // sending string for testing compatibility
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <span className="text-orange-500">🍽️</span> Reserve a Portion
      </h2>

      {success && (
        <div className="mb-6 bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm font-medium border border-emerald-200">
          Meal portion secured successfully!
        </div>
      )}

      <form onSubmit={bookMeal} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <select 
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 font-medium text-slate-700"
          >
            <option value="Breakfast">Tomorrow Breakfast</option>
            <option value="Lunch">Tomorrow Lunch</option>
            <option value="Dinner">Tomorrow Dinner</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 whitespace-nowrap"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}