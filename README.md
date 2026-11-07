# static-assets

Large files for imtiazkarim.com, served through the jsDelivr CDN instead of being uploaded to Vercel with every deploy.

- `bd-telecom/docs/`: BTRC PDFs linked from /bd-telecom/
- `work/*/*-slides.pdf`: case-study slide decks linked from /work/

The live site redirects those URLs here (see `vercel.json` on `main`). This branch is never deployed to Vercel.
