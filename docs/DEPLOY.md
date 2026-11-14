# Publish EquiPath AI

The core dashboard, real aggregate data, rules engine, scenario testing and export work as a **static website**, without an API key or a server.

## GitHub

From the directory containing `index.html`, run:

```bash
git init
git add .
git commit -m "Junction 2026: EquiPath AI CareProof prototype"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/equipath-ai.git
git push -u origin main
```

Or create an empty GitHub repository and upload the **contents** of the project folder (not an outer ZIP) using GitHub's web interface.

## Free deployment option 1 — Netlify Drop

1. Visit https://app.netlify.com/drop/.
2. Upload the ZIP containing `index.html` at its root, or drag the project directory if supported.
3. Claim the site and copy its actual `*.netlify.app` URL.
4. Open the URL on a different browser/device to verify its public visibility.

## Free deployment option 2 — Vercel

1. Import the GitHub repository at https://vercel.com/new.
2. Choose `Other` / no framework. Root directory: project root.
3. No build command is needed. Deploy the production branch.
4. Check the assigned `*.vercel.app` URL.
5. Optional: Set `OPENAI_API_KEY`, `DEMO_ACCESS_TOKEN`, `OPENAI_MODEL` in the Vercel project environment. Then redeploy to activate `/api/analyze`.

**A live deployment URL cannot be known until the hosting provider publishes the project. Do not put a guessed URL in the Junction submission.**

## Run locally

```bash
python3 -m http.server 8080
# http://localhost:8080
node --test tests/*.test.js
```

### Medical-data boundaries

No real patient data is required or used. The 2024 regional screening data are public aggregates. All care-transfer event sequences are synthetic. The what-if scenario is arithmetic only. A real health-service pilot would require operational approval, information-security review and clinical validation.
