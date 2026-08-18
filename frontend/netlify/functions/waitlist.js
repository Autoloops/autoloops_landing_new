const { addEntry, listEntries } = require("../../lib/waitlist-db");

const cors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-waitlist-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: cors,
    body: JSON.stringify(body),
  };
}

function fieldErrors(email) {
  const fields = {};
  if (!email) fields.email = "Enter your email.";
  else if (!email.includes("@") || !/.+@.+\..+/.test(email)) {
    fields.email = "Enter a valid email.";
  }
  return fields;
}

function dbError(err) {
  if (err.code === "config") {
    return json(503, { error: err.message });
  }
  return json(500, { error: err.message || "Waitlist storage is unavailable." });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors };
  }

  if (event.httpMethod === "POST") {
    let payload = {};
    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { error: "Invalid request." });
    }

    const email = String(payload.email || "").trim().toLowerCase();
    const fields = fieldErrors(email);
    if (Object.keys(fields).length) {
      return json(400, { error: Object.values(fields)[0], fields });
    }
    const name =
      String(payload.name || "").trim() || email.split("@")[0] || "waitlist";

    try {
      const entry = await addEntry({ name, email });
      return json(200, { ok: true, entry });
    } catch (err) {
      return dbError(err);
    }
  }

  if (event.httpMethod === "GET") {
    const expected = process.env.WAITLIST_VIEW_KEY;
    if (!expected) {
      return json(503, { error: "Set WAITLIST_VIEW_KEY on Netlify to view signups." });
    }
    const provided =
      event.headers["x-waitlist-key"] ||
      event.headers["X-Waitlist-Key"] ||
      event.queryStringParameters?.key;
    if (provided !== expected) {
      return json(401, { error: "Unauthorized" });
    }
    try {
      const entries = await listEntries();
      return json(200, { entries });
    } catch (err) {
      return dbError(err);
    }
  }

  return json(405, { error: "Method not allowed" });
};
