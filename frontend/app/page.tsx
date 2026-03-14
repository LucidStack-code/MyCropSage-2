"use client";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const checkBackend = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/health");
      const data = await res.json();
      setStatus(`✅ Backend says: ${data.status} — ${data.service}`);
    } catch {
      setStatus("❌ Could not reach backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold text-green-700">🌿 MyCropSage</h1>
      <p className="text-gray-500">Phase 1 — Health Check</p>
      <button
        onClick={checkBackend}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        {loading ? "Checking..." : "Ping Backend"}
      </button>
      {status && (
        <p className="text-lg font-medium text-gray-700">{status}</p>
      )}
    </main>
  );
}