const express = require("express");
const { addEntry, listEntries } = require("../lib/waitlist-db");

function fieldErrors(name, email) {
  const fields = {};
  if (!name) fields.name = "Enter your name.";
  if (!email) fields.email = "Enter your email.";
  else if (!/.+@.+\..+/.test(email)) fields.email = "Enter a valid email.";
  return fields;
}

function setupWaitlist(devServer) {
  if (!devServer?.app) return;

  const json = express.json();

  devServer.app.post("/api/waitlist", json, async (req, res) => {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const fields = fieldErrors(name, email);
    if (Object.keys(fields).length) {
      return res.status(400).json({
        error: Object.values(fields)[0],
        fields,
      });
    }

    try {
      const entry = await addEntry({ name, email });
      res.json({ ok: true, entry });
    } catch (err) {
      const status = err.code === "config" ? 503 : 500;
      res.status(status).json({ error: err.message || "Could not save signup." });
    }
  });

  devServer.app.get("/api/waitlist", async (req, res) => {
    const expected = process.env.WAITLIST_VIEW_KEY;
    if (!expected) {
      return res.status(503).json({
        error: "Set WAITLIST_VIEW_KEY in frontend/.env to view signups.",
      });
    }
    const provided = req.get("x-waitlist-key") || req.query.key;
    if (provided !== expected) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const entries = await listEntries();
      res.json({ entries });
    } catch (err) {
      const status = err.code === "config" ? 503 : 500;
      res.status(status).json({ error: err.message || "Could not load signups." });
    }
  });
}

module.exports = setupWaitlist;
