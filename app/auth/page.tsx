"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/analyze";
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Account created! Check your email to confirm, then log in.");
      }
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#07060b] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 via-emerald-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M4 12h4l3-7 4 14 3-7h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[17px] font-bold tracking-tight">
            Sav<span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">Flix</span>
          </span>
        </div>

        <div className="border border-white/[0.08] bg-white/[0.02] rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            {isLogin ? "Log in to access your savings plan" : "Start saving on streaming today"}
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm focus:border-purple-500 focus:outline-none transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              />
            </div>
          </div>

          {error && <div className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</div>}
          {message && <div className="mt-4 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">{message}</div>}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">← Back to SavFlix</a>
        </div>
      </div>
    </main>
  );
}