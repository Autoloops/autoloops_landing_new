import React, { useEffect, useState } from 'react';

function fieldErrors(name, email) {
  const fields = {};
  if (!name.trim()) fields.name = "Enter your name.";
  if (!email.trim()) fields.email = "Enter your email.";
  else if (!/.+@.+\..+/.test(email.trim())) fields.email = "Enter a valid email.";
  return fields;
}

const inputClass = (invalid) =>
  `w-full rounded-none border bg-[#fbfaf7] px-3.5 py-3 font-jetbrains text-xs text-[#141414] outline-none placeholder:text-[#aaa] focus:border-[#0d7a3f] ${
    invalid ? "border-[#b3261e]" : "border-[#141414]"
  }`;

const WaitlistModal = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setSent(false);
      setError("");
      setErrors({ name: "", email: "" });
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  const close = () => {
    if (saving) return;
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = fieldErrors(name, email);
    setErrors({
      name: nextErrors.name || "",
      email: nextErrors.email || "",
    });
    if (nextErrors.name || nextErrors.email) {
      setError(nextErrors.name || nextErrors.email);
      return;
    }

    setError("");
    setSaving(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrors({
          name: payload.fields?.name || "",
          email: payload.fields?.email || "",
        });
        throw new Error(payload.error || "Couldn't save. Try again.");
      }
      setSent(true);
      setName("");
      setEmail("");
    } catch (err) {
      setError(err.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(20,20,20,.55)]"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
        className="waitlist-modal w-[420px] max-w-[90vw] rounded-none border border-[#141414] bg-[#fbfaf7]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#141414] px-6 py-3 font-jetbrains text-[10.5px]">
          <span>WAITLIST</span>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer rounded-none border-0 bg-transparent p-0 font-jetbrains text-xs text-[#141414]"
            aria-label="Close waitlist"
          >
            ✕
          </button>
        </div>
        {sent ? (
          <div className="px-6 py-8 text-center">
            <div className="font-jetbrains text-xs font-bold text-[#0d7a3f]">
              ✓ YOU'RE ON THE LIST
            </div>
            <p className="mt-2.5 mb-0 text-[13px] text-[#666]">
              We'll reach out when the API opens up.
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-3 px-6 py-6" onSubmit={submit} autoComplete="off">
            <div id="waitlist-title" className="text-xl font-extrabold tracking-[-0.02em]">
              Get early access
            </div>
            <div>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="name"
                name="waitlist-display"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                data-1p-ignore="true"
                data-lpignore="true"
                aria-invalid={Boolean(errors.name)}
                className={inputClass(errors.name)}
              />
              {errors.name && (
                <p className="mt-1 mb-0 font-jetbrains text-[10.5px] text-[#b3261e]">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="you@company.com"
                name="waitlist-contact"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                data-1p-ignore="true"
                data-lpignore="true"
                aria-invalid={Boolean(errors.email)}
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <p className="mt-1 mb-0 font-jetbrains text-[10.5px] text-[#b3261e]">
                  {errors.email}
                </p>
              )}
            </div>
            {error && !errors.name && !errors.email && (
              <p className="m-0 font-jetbrains text-[10.5px] text-[#b3261e]">{error}</p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full cursor-pointer rounded-none border-0 bg-[#141414] px-0 py-[13px] font-archivo text-sm font-bold text-[#fbfaf7] hover:bg-[#0d7a3f] disabled:cursor-wait disabled:opacity-70"
            >
              {saving ? "Saving…" : "Join waitlist →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
