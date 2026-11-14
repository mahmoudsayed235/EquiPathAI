# Upload EquiPath AI to GitHub

1. Create a new empty GitHub repository named `equipath-ai` (do not initialize it with a README).
2. Extract the `EquiPathAI_GitHub_Ready.zip` archive.
3. Open a terminal in the extracted `equipath-ai` directory (the directory containing `package.json`).
4. Run:

```bash
git init
git add .
git commit -m "Initial EquiPath AI prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/equipath-ai.git
git push -u origin main
```

Or choose GitHub's **Add file → Upload files** and upload the **contents** of the extracted folder. GitHub cannot import a ZIP as a repository directly.

Run locally with `python3 -m http.server 8080`. Test using `npm test` (Node.js 20+). The source requires no `npm install` for the static app or test suite.

## Scope

The working demonstration is **colorectal screening follow-up**, using public aggregate 2024 data and synthetic event scenarios. `SUBMISSION.md` contains the team's supplied broader product description referencing lung cancer as an intended initial use case; adjust that statement before judging if the live demo remains colorectal-only.
