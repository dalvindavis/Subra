"use client";
import { useState, useEffect } from "react";

const SERVICES = [
  { name: "Netflix", price: 15.49 },
  { name: "Hulu", price: 7.99 },
  { name: "Disney+", price: 7.99 },
  { name: "HBO/Max", price: 15.99 },
  { name: "Apple TV+", price: 9.99 },
  { name: "Peacock", price: 7.99 },
  { name: "Paramount+", price: 7.99 },
  { name: "Amazon Prime Video", price: 8.99 },
  { name: "AMC+", price: 8.99 },
  { name: "Starz", price: 9.99 },
  { name: "YouTube Premium", price: 13.99 },
  { name: "MGM+", price: 6.99 },
];

export default function Analyze() {
  const [selected, setSelected] = useState<string[]>([]);
  const [showQuery, setShowQuery] = useState("");
  const [showResults, setShowResults] = useState<any[]>([]);
  const [myShows, setMyShows] = useState<any[]>([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showQuery.length < 2) {
      setShowResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/tmdb?query=${encodeURIComponent(showQuery)}`);
      const data = await res.json();
      setShowResults(data.results || []);
    }, 400);
    return () => clearTimeout(timer);
  }, [showQuery]);

  const toggleService = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const addShow = (show: any) => {
    if (!myShows.find((s) => s.id === show.id)) {
      setMyShows((prev) => [...prev, show]);
    }
    setShowQuery("");
    setShowResults([]);
  };

  const removeShow = (id: number) => {
    setMyShows((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAnalyze = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    setResult("");
    const input = `My current subscriptions: ${selected.join(", ")}.${
      myShows.length > 0
        ? ` Shows I actively watch: ${myShows.map((s) => s.name).join(", ")}.`
        : ""
    }`;
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelected([]);
    setMyShows([]);
    setResult("");
    setShowQuery("");
  };

  const renderResults = (text: string) => {
    const sections = text.split(/###\s*/);
    const colors: Record<string, string> = {
      "what to cut": "border-red-500",
      "what to keep": "border-green-500",
      "why it matters": "border-purple-500",
      "binge plan": "border-yellow-500",
      "your binge calendar": "border-yellow-500",
    };
    const bgColors: Record<string, string> = {
      "what to cut": "bg-red-500/5",
      "what to keep": "bg-green-500/5",
      "why it matters": "bg-purple-500/5",
      "binge plan": "bg-yellow-500/5",
      "your binge calendar": "bg-yellow-500/5",
    };
    return sections
      .filter((s) => s.trim())
      .map((section, i) => {
        const lines = section.trim().split("\n");
        const title = lines[0]?.trim() || "";
        const body = lines.slice(1).join("\n").trim();
        const key = title.toLowerCase().replace(/[^a-z\s]/g, "").trim();
        const borderColor = colors[key] || "border-gray-700";
        const bgColor = bgColors[key] || "bg-gray-900/50";
        return (
          <div key={i} className={"border-l-4 " + borderColor + " " + bgColor + " rounded-xl p-6 mb-4"}>
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{body}</div>
          </div>
        );
      });
  };

  const totalMonthly = selected.reduce((sum, name) => {
    const svc = SERVICES.find((s) => s.name === name);
    return sum + (svc?.price || 0);
  }, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white px-6 py-12 max-w-3xl mx-auto">
      <a href="/" className="text-purple-400 hover:text-purple-300 transition text-sm mb-8 inline-block">Back to Home</a>

      {!result && (
        <>
          <h1 className="text-3xl font-bold mb-2">Build Your Streaming Profile</h1>
          <p className="text-gray-400 text-sm mb-8">Select your subscriptions and tell us what you watch. We will find the smartest way to save.</p>

          <h2 className="text-lg font-semibold mb-4">Your Subscriptions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
            {SERVICES.map((svc) => (
              <button
                key={svc.name}
                onClick={() => toggleService(svc.name)}
                className={
                  "p-3 rounded-xl border text-left text-sm transition " +
                  (selected.includes(svc.name)
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-gray-700 bg-gray-900/30 text-gray-400 hover:border-gray-500")
                }
              >
                <div className="font-medium">{svc.name}</div>
                <div className="text-xs mt-1">${svc.price}/mo</div>
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <p className="text-sm text-gray-400 mb-8">Current total: <span className="text-white font-semibold">${totalMonthly.toFixed(2)}/mo</span></p>
          )}

          <div className="border-t border-gray-800 my-8"></div>

          <h2 className="text-lg font-semibold mb-2">Shows You Watch</h2>
          <p className="text-gray-400 text-xs mb-4">This helps us find the cheapest platform combo and build your binge plan.</p>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search any show..."
              className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-sm focus:border-purple-500 focus:outline-none transition"
              value={showQuery}
              onChange={(e) => setShowQuery(e.target.value)}
            />
            {showResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden z-10">
                {showResults.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => addShow(show)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition text-left"
                  >
                    {show.poster && (
                      <img src={show.poster} alt="" className="w-8 h-12 rounded object-cover" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{show.name}</div>
                      <div className="text-xs text-gray-500">{show.year}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {myShows.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {myShows.map((show) => (
                <span key={show.id} className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/30 rounded-full px-3 py-1 text-sm">
                  {show.name}
                  <button onClick={() => removeShow(show.id)} className="text-purple-300 hover:text-white ml-1">x</button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || selected.length === 0}
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-500 transition shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {loading ? "Analyzing..." : "Analyze My Subscriptions"}
          </button>
        </>
      )}

      {loading && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Scanning your subscriptions for overlaps and building your binge plan...</p>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h1 className="text-3xl font-bold mb-2">Your Results</h1>
          <p className="text-gray-400 text-sm mb-6">Based on {selected.length} subscriptions{myShows.length > 0 ? ` and ${myShows.length} shows you watch` : ""}</p>
          {renderResults(result)}
          <button
            onClick={handleReset}
            className="mt-6 border border-purple-500/50 text-purple-400 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-purple-500/10 transition"
          >
            Run Another Analysis
          </button>
        </div>
      )}
    </main>
  );
}