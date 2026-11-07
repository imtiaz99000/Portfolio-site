# imtiazkarim.com

Personal site of Mohd Imtiaz Karim: one static page (`index.html`) and a photo. Hosted on Vercel, DNS on Cloudflare.
Contact links are set in one place at the bottom of `index.html` (`CONTACT`).

## Large files (keep Vercel deploys small)
Each push stores a full copy of the site on Vercel (Hobby plan: 10 GB Deployment Storage), so big files are kept in Git but not uploaded (see `.vercelignore`):

- **PDFs** (`bd-telecom/docs/`, `work/*/*.pdf`) are served from the `static-assets` branch through jsDelivr; `vercel.json` redirects the old URLs there, pinned to one commit of that branch. **To add or change a PDF:** commit it to `static-assets` (same path), then update the commit hash in the two PDF redirects in `vercel.json`. A PDF added only to `main` will 404.
- **PixelShrink** loads its model from this repo on raw.githubusercontent.com (pinned commit in `tools/pixelshrink/bg.js`) and the ONNX Runtime engine from jsDelivr (`onnxruntime-web@1.21.0`).
