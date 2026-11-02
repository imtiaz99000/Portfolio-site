// GET  -> { docs, savedAt }               all saved documents
// POST { set: {id: doc}, del: [id] }      merge changes and save
// POST { replace: {id: doc} }             replace everything (used by "restore backup")
// Every call needs the session token from /api/taka/login.
const { checkToken, readDocs, writeDocs, body, send } = require("./_lib");

const ID = /^[A-Za-z0-9_-]{1,40}$/;
const MAX_BYTES = 4 * 1024 * 1024;

module.exports = async (req, res) => {
  if (!checkToken(req)) return send(res, 401, { error: "Please sign in" });
  try {
    if (req.method === "GET") return send(res, 200, await readDocs());
    if (req.method !== "POST") return send(res, 405, { error: "Use GET or POST" });
    const b = await body(req);
    let docs;
    if (b.replace && typeof b.replace === "object") docs = {};
    else docs = (await readDocs()).docs;
    const set = b.replace || b.set || {};
    for (const [k, v] of Object.entries(set)) { if (!ID.test(k) || typeof v !== "object" || v === null) return send(res, 400, { error: "Bad document " + k }); docs[k] = v; }
    for (const k of b.del || []) delete docs[k];
    if (Buffer.byteLength(JSON.stringify(docs)) > MAX_BYTES) return send(res, 413, { error: "Data is too large" });
    const savedAt = await writeDocs(docs);
    send(res, 200, { ok: true, savedAt });
  } catch (e) {
    send(res, e.status || 500, { error: e.message || "Server error" });
  }
};
