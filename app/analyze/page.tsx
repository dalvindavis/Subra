"use client";
import { useState } from "react";

export default function Analyze() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
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

  const renderResults = (text: string) => {
    const sections = text.split(/###\s*/);
    const colors: Record<string, string> = {
      "what to cut": "border-red-500",
      "what to keep": "border-green-500",
      "why it matters": "border-purple-500",
    };
    const bgColors: Record<string, string> = {
      "what to cut": "bg-red-500/5",
      "what to keep": "bg-green-500/5",
      "why it matters": "bg-purple-500/5",
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-white px-6 py-12 max-w-3xl mx-auto">
      <a href="/" className="text-purple-400 hover:text-purple-300 transition text-sm mb-8 inline-block">Back to Home</a>
      <h1 className="text-3xl font-bold mb-2">Analyze Your Content</h1>
      <p className="text-gray-400 text-sm mb-6">Paste your subscriptions, tools, or marketing content below.</p>
      <textarea
        placeholder="e.g. Netflix, Hulu, Disney+, HBO Max, Apple TV+..."
        className="w-full h-40 p-4 rounded-xl bg-gray-900/50 border border-gray-700 mb-4 focus:border-purple-500 focus:outline-none transition text-sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleAnalyze}
        disabled={loading || !input}
        className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-500 transition shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {result && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          {renderResults(result)}
        </div>
      )}
    </main>
  );
}