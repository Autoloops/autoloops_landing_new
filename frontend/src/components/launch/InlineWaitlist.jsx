import React, { useState } from 'react';

const InlineWaitlist = ({ email, setEmail, sent, setSent }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!value.includes("@")) {
      setError("Enter a valid email.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          name: value.split("@")[0] || "waitlist",
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Couldn't save. Try again.");
      }
      setSent(true);
    } catch (err) {
      setError(err.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (sent) {
    return (
      <div className="launch-email-box self-start border border-[#0d7a3f] px-4 py-3 font-jetbrains text-[11px] font-bold text-[#0d7a3f]">
        ✓ YOU'RE IN — we'll email you access.
      </div>
    );
  }

  return (
    <div className="launch-email-box self-start">
      <form className="inline-flex border border-[#141414]" onSubmit={submit} autoComplete="off">
        <input
          type="text"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
          placeholder="you@company.com"
          name="waitlist-contact"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          data-1p-ignore="true"
          data-lpignore="true"
          className="w-[220px] rounded-none border-0 bg-[#fbfaf7] px-[14px] py-3 font-jetbrains text-xs text-[#141414] outline-none placeholder:text-[#aaa]"
        />
        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-none border-0 border-l border-[#141414] bg-[#141414] px-[18px] font-jetbrains text-[11px] font-bold tracking-[0.06em] text-[#fbfaf7] hover:bg-[#0d7a3f] disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? "APPLY…" : "APPLY →"}
        </button>
      </form>
      {error && (
        <p className="mb-0 mt-1.5 font-jetbrains text-[10.5px] text-[#b3261e]">{error}</p>
      )}
    </div>
  );
};

export default InlineWaitlist;
