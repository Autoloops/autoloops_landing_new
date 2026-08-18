function config() {
  const url = String(process.env.SUPABASE_URL || "")
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    const err = new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    err.code = "config";
    throw err;
  }
  return { url, key };
}

function headers(key, extra) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function addEntry({ name, email }) {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/waitlist?on_conflict=email`, {
    method: "POST",
    headers: headers(key, {
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify({ name, email }),
  });
  const payload = await readJson(response);
  if (!response.ok) {
    const err = new Error(
      (payload && (payload.message || payload.error)) || "Could not save signup.",
    );
    err.status = response.status;
    throw err;
  }
  const row = Array.isArray(payload) ? payload[0] : payload;
  return mapRow(row);
}

async function listEntries() {
  const { url, key } = config();
  const response = await fetch(
    `${url}/rest/v1/waitlist?select=id,name,email,created_at&order=created_at.desc`,
    { headers: headers(key) },
  );
  const payload = await readJson(response);
  if (!response.ok) {
    const err = new Error(
      (payload && (payload.message || payload.error)) || "Could not load signups.",
    );
    err.status = response.status;
    throw err;
  }
  return Array.isArray(payload) ? payload.map(mapRow) : [];
}

module.exports = { addEntry, listEntries };
