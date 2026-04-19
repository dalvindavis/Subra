"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [plan, setPlan] = useState("");

  useEffect(() => {
    setMounted(true);
    const checkPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();
        if (profile) setPlan(profile.plan);
      }
    };
    checkPlan();
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#07060b] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
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
        <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-green-400">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">You are all set!</h1>
          <p className="text-gray-400 text-sm mb-2">
            {plan === 'lifetime'
              ? "Welcome to SavFlix Lifetime. You have full access forever."
              : "Welcome to SavFlix Basic. Your subscription is now active."}
          </p>
          <p className="text-gray-500 text-xs mb-8">
            A confirmation email is on its way to you.
          </p>
          <div className="space-y-3">
            <a href="/analyze" className="block w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-purple-600/20">
              Start Saving Now
            </a>
            <a href="/" className="block w-full border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.2] py-3.5 rounded-xl font-medium transition-all duration-300">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}