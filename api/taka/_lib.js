// Shared helpers for the private Taka Gelo Koi? site (taka.imtiazkarim.com).
// Login: the admin key lives only in the TAKA_ADMIN_KEY environment variable on Vercel.
// Storage: one encrypted JSON file in Vercel Blob. Every save writes a new file and removes the old ones,
// so a read never sees a cached older copy.
const crypto = require("crypto");

const PREFIX = "taka/state-";
const SESSION_DAYS = 30;

function adminKey() {
  const k = process.env.TAKA_ADMIN_KEY || "";
  return k.length >= 10 ? k : null; // refuse to run with a missing or weak key
}

// The data is encrypted with a key derived from the Blob store's own secret token, so changing the
// admin key later never locks you out of your data.
function dataKey() {
  const src = process.env.TAKA_DATA_KEY || process.env.BLOB_READ_WRITE_TOKEN || "";
  if (!src) throw Object.assign(new Error("Storage is not connected yet. Connect a Blob store to this Vercel project."), { status: 500 });
  return crypto.createHash("sha256").update("taka-gelo-koi:data:" + src).digest();
}

function sign(payload) {
  return crypto.createHmac("sha256", adminKey()).update(payload).digest("base64url");
}
function makeToken() {
  const exp = String(Date.now() + SESSION_DAYS * 864e5);
  return exp + "." + sign(exp);
}
function checkToken(req) {
  if (!adminKey()) return false;
  const h = req.headers["authorization"] || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
  const [exp, sig] = tok.split(".");
  if (!exp || !sig || +exp < Date.now()) return false;
  const good = Buffer.from(sign(exp)), got = Buffer.from(sig);
  return good.length === got.length && crypto.timingSafeEqual(good, got);
}
function sameKey(given) {
  const a = crypto.createHash("sha256").update(String(given || "")).digest();
  const b = crypto.createHash("sha256").update(adminKey()).digest();
  return crypto.timingSafeEqual(a, b);
}

function encrypt(obj) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", dataKey(), iv);
  const body = Buffer.concat([c.update(JSON.stringify(obj), "utf8"), c.final()]);
  return Buffer.concat([Buffer.from("TGK1"), iv, c.getAuthTag(), body]);
}
function decrypt(buf) {
  if (buf.slice(0, 4).toString() !== "TGK1") throw new Error("Unknown data format");
  const iv = buf.slice(4, 16), tag = buf.slice(16, 32), body = buf.slice(32);
  const d = crypto.createDecipheriv("aes-256-gcm", dataKey(), iv);
  d.setAuthTag(tag);
  return JSON.parse(Buffer.concat([d.update(body), d.final()]).toString("utf8"));
}

// Storage backend: Vercel Blob in production; a local folder when TAKA_LOCAL_DIR is set (for testing).
function store() {
  if (process.env.TAKA_LOCAL_DIR) {
    const fs = require("fs"), path = require("path"), dir = process.env.TAKA_LOCAL_DIR;
    fs.mkdirSync(path.join(dir, "taka"), { recursive: true });
    return {
      async list() { return fs.readdirSync(path.join(dir, "taka")).filter(f => f.startsWith("state-")).map(f => ({ pathname: "taka/" + f, url: path.join(dir, "taka", f) })); },
      async get(b) { return fs.readFileSync(b.url); },
      async put(name, buf) { fs.writeFileSync(path.join(dir, name), buf); },
      async del(bs) { for (const b of bs) fs.unlinkSync(b.url); },
    };
  }
  const blob = require("@vercel/blob");
  // Works with a Private store (recommended) or a Public one. Private is tried first and remembered.
  let access = process.env.TAKA_BLOB_ACCESS || null;
  const isAccessErr = e => /access|private|public/i.test(String(e && e.message));
  return {
    async list() { const r = await blob.list({ prefix: PREFIX, limit: 100 }); return r.blobs; },
    async get(b) {
      if (access !== "public") {
        try {
          const r = await blob.get(b.url, { access: "private", useCache: false });
          if (r && r.statusCode === 200) { access = "private"; return Buffer.from(await new Response(r.stream).arrayBuffer()); }
        } catch (e) { if (access === "private" || !isAccessErr(e)) throw e; }
      }
      const r = await fetch(b.url + "?v=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error("Could not read saved data (" + r.status + ")");
      access = "public"; return Buffer.from(await r.arrayBuffer());
    },
    async put(name, buf) {
      const opts = a => ({ access: a, addRandomSuffix: true, contentType: "application/octet-stream", cacheControlMaxAge: 60 });
      if (access !== "public") {
        try { await blob.put(name, buf, opts("private")); access = "private"; return; }
        catch (e) { if (access === "private" || !isAccessErr(e)) throw e; }
      }
      await blob.put(name, buf, opts("public")); access = "public";
    },
    async del(bs) { if (bs.length) await blob.del(bs.map(b => b.url)); },
  };
}

const latestFirst = (a, b) => b.pathname.localeCompare(a.pathname);

async function readDocs() {
  const st = store();
  const all = (await st.list()).sort(latestFirst);
  if (!all.length) return { docs: {}, savedAt: null };
  const doc = decrypt(await st.get(all[0]));
  return { docs: doc.docs || {}, savedAt: doc.savedAt || null };
}
async function writeDocs(docs) {
  const st = store();
  const before = await st.list();
  const savedAt = new Date().toISOString();
  // name sorts by time, so the newest file is always picked first
  await st.put(PREFIX + Date.now().toString().padStart(15, "0") + ".bin", encrypt({ v: 1, savedAt, docs }));
  try { await st.del(before); } catch (e) { /* old copies are harmless; next save retries */ }
  return savedAt;
}

async function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  const chunks = []; for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}
function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  res.end(JSON.stringify(obj));
}
const wait = ms => new Promise(r => setTimeout(r, ms));

module.exports = { adminKey, makeToken, checkToken, sameKey, readDocs, writeDocs, body, send, wait };
