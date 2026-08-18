import React, { useEffect, useState } from 'react';

const WaitlistEntries = () => {
  const [key, setKey] = useState("");
  const [needsKey, setNeedsKey] = useState(false);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (viewKey) => {
    setLoading(true);
    setError("");
    try {
      const headers = { Accept: "application/json" };
      if (viewKey) headers["x-waitlist-key"] = viewKey;
      const response = await fetch("/api/waitlist", { headers });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 503) {
        setNeedsKey(true);
        setEntries([]);
        setError(payload.error === "Unauthorized" ? "Enter the waitlist view key." : (payload.error || "Key required."));
        return;
      }
      if (!response.ok) {
        throw new Error(payload.error || "Couldn't load signups.");
      }
      setNeedsKey(false);
      setEntries(Array.isArray(payload.entries) ? payload.entries : []);
    } catch (err) {
      setError(err.message || "Couldn't load signups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="launch-page min-h-screen px-6 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="font-jetbrains text-[11px] text-[#0d7a3f]">
          ← autoloops
        </a>
        <h1 className="mt-6 mb-2 font-archivo text-3xl font-extrabold tracking-[-0.03em]">
          Waitlist
        </h1>
        <p className="mb-8 font-jetbrains text-xs text-[#888]">
          People who applied for beta
        </p>

        {needsKey && (
          <form
            className="mb-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              load(key.trim());
            }}
          >
            <input
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="view key"
              className="flex-1 rounded-none border border-[#141414] bg-[#fbfaf7] px-3.5 py-3 font-jetbrains text-xs text-[#141414] outline-none placeholder:text-[#aaa] focus:border-[#0d7a3f]"
            />
            <button
              type="submit"
              className="rounded-none border-0 bg-[#141414] px-5 py-3 font-jetbrains text-xs font-bold text-[#fbfaf7] hover:bg-[#0d7a3f]"
            >
              View
            </button>
          </form>
        )}

        {error && (
          <p className="mb-6 font-jetbrains text-xs text-[#b3261e]">{error}</p>
        )}

        {loading ? (
          <p className="font-jetbrains text-xs text-[#888]">Loading…</p>
        ) : (
          <div className="border border-[#141414] bg-[#fbfaf7]">
            <div className="grid grid-cols-[1fr_1.4fr_auto] border-b border-[#141414] px-4 py-2.5 font-jetbrains text-[10px] text-[#888]">
              <span>name</span>
              <span>email</span>
              <span>when</span>
            </div>
            {entries.length === 0 ? (
              <p className="px-4 py-8 font-jetbrains text-xs text-[#888]">
                No signups yet.
              </p>
            ) : (
              entries
                .slice()
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id || `${entry.email}-${entry.createdAt}`}
                    className="grid grid-cols-[1fr_1.4fr_auto] border-b border-[#141414] px-4 py-3 last:border-b-0"
                  >
                    <span className="text-sm text-[#141414]">{entry.name}</span>
                    <span className="font-jetbrains text-xs text-[#444]">
                      {entry.email}
                    </span>
                    <span className="font-jetbrains text-[10.5px] text-[#888]">
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistEntries;
