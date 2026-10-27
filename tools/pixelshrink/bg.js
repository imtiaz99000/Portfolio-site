// Background removal for PixelShrink: ISNet (general-use) running on-device with ONNX Runtime Web.
// The model ships with the page in four parts (served with a .wasm name so the host accepts the bytes) and is kept in the browser's cache after the first download.
import * as ort from "./ort.wasm.min.mjs";

const BASE = new URL("./", import.meta.url).href;
ort.env.wasm.wasmPaths = BASE;
ort.env.wasm.numThreads = 1;
ort.env.wasm.proxy = false;

const PARTS = ["isnet.part0.wasm", "isnet.part1.wasm", "isnet.part2.wasm", "isnet.part3.wasm"];
const TOTAL = 46789470;
const SIZE = 1024;
const CACHE = "pixelshrink-bg-v1";
let sessionPromise = null;

async function getPart(name, onBytes) {
  let cache = null;
  try { cache = await caches.open(CACHE); const hit = await cache.match(BASE + name); if (hit) { const b = await hit.arrayBuffer(); onBytes(b.byteLength); return b; } } catch (e) { cache = null; }
  const res = await fetch(BASE + name);
  if (!res.ok) throw new Error("download failed");
  const reader = res.body.getReader(); const chunks = []; let got = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); got += value.byteLength; onBytes(value.byteLength); }
  const buf = new Uint8Array(got); let o = 0; for (const c of chunks) { buf.set(c, o); o += c.byteLength; }
  try { if (cache) await cache.put(BASE + name, new Response(buf.slice(0), { headers: { "Content-Type": "application/octet-stream" } })); } catch (e) {}
  return buf.buffer;
}

export function load(onProgress = () => {}) {
  if (sessionPromise) return sessionPromise;
  sessionPromise = (async () => {
    let loaded = 0;
    const bufs = [];
    for (const p of PARTS) bufs.push(await getPart(p, n => { loaded += n; onProgress(Math.min(1, loaded / TOTAL)); }));
    const model = new Uint8Array(TOTAL); let o = 0;
    for (const b of bufs) { model.set(new Uint8Array(b), o); o += b.byteLength; }
    return ort.InferenceSession.create(model, { executionProviders: ["wasm"], graphOptimizationLevel: "all" });
  })().catch(e => { sessionPromise = null; throw e; });
  return sessionPromise;
}

// Returns a 1024×1024 canvas whose alpha channel is the foreground mask for `src` (an ImageBitmap/Image/canvas).
export async function mask(src, w, h) {
  const session = await load();
  const c = document.createElement("canvas"); c.width = SIZE; c.height = SIZE;
  const cx = c.getContext("2d", { willReadFrequently: true });
  cx.imageSmoothingQuality = "high"; cx.drawImage(src, 0, 0, w, h, 0, 0, SIZE, SIZE);
  const px = cx.getImageData(0, 0, SIZE, SIZE).data;
  let max = 1; for (let i = 0; i < px.length; i += 4) { if (px[i] > max) max = px[i]; if (px[i + 1] > max) max = px[i + 1]; if (px[i + 2] > max) max = px[i + 2]; }
  const N = SIZE * SIZE, input = new Float32Array(3 * N), mean = [0.485, 0.456, 0.406];
  for (let i = 0, j = 0; j < N; i += 4, j++) {
    input[j] = px[i] / max - mean[0]; input[N + j] = px[i + 1] / max - mean[1]; input[2 * N + j] = px[i + 2] / max - mean[2];
  }
  const out = await session.run({ input_image: new ort.Tensor("float32", input, [1, 3, SIZE, SIZE]) });
  const m = out[session.outputNames[0]].data;
  let mn = Infinity, mx = -Infinity; for (let i = 0; i < N; i++) { const v = m[i]; if (v < mn) mn = v; if (v > mx) mx = v; }
  const span = mx - mn || 1, img = cx.createImageData(SIZE, SIZE), d = img.data;
  for (let i = 0, k = 0; i < N; i++, k += 4) { d[k] = d[k + 1] = d[k + 2] = 0; d[k + 3] = Math.round(((m[i] - mn) / span) * 255); }
  cx.putImageData(img, 0, 0);
  return c;
}
