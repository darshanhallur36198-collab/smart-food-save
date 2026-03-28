"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth() || {};
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/register", formData);
      if (data.token) {
        if (login) login(data.token);
        else localStorage.setItem("token", data.token);
        toast("Account created! Welcome to FoodSave 🌱", "success");
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">Join FoodSave to start managing your meals</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50 p-8 sm:p-10">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 text-center animate-pulse">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-white/50 outline-none text-slate-800 font-medium placeholder-slate-400"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-white/50 outline-none text-slate-800 font-medium placeholder-slate-400"
                placeholder="jane@university.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-white/50 outline-none text-slate-800 font-medium placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-white/50 outline-none text-slate-800 font-medium"
              >
                <option value="student">Student</option>
                <option value="staff">Staff Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Already a member?{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold underline decoration-2 underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500 transition-all">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}