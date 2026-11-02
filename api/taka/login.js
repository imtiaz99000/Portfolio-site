// POST { key } -> { token } when the admin key matches TAKA_ADMIN_KEY.
const { adminKey, makeToken, sameKey, body, send, wait } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  if (!adminKey()) return send(res, 500, { error: "The admin key is not set up yet. Add TAKA_ADMIN_KEY (at least 10 characters) in Vercel settings." });
  let b; try { b = await body(req); } catch (e) { return send(res, 400, { error: "Bad request" }); }
  if (!sameKey(b.key)) { await wait(1200); return send(res, 401, { error: "Wrong admin key" }); }
  send(res, 200, { token: makeToken() });
};
