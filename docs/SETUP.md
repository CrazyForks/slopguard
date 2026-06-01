# SlopGuard — Setup & Deploy

Three paths: **(A) Deploy to Vercel**, **(B) Create the GitHub App (1-click manifest)**, **(C) Local dev with smee**.

---

## A. Deploy to Vercel (do this first so you have a public URL)

```bash
cd slopguard
npm i -g vercel
vercel            # link/create project (accept defaults)
vercel --prod     # first prod deploy → gives you https://<app>.vercel.app
```

Note your prod URL, e.g. `https://slopguard.vercel.app`. Set it as `APP_BASE_URL`
in Vercel env (Step B fills in the GitHub secrets).

> Vercel auto-detects Next.js. The webhook runs as a Node serverless function
> (`maxDuration: 60s`, see `vercel.json`). No extra config needed.

---

## B. Create the GitHub App (1-click, from manifest)

SlopGuard ships a manifest-create flow so you don't hand-fill permissions.

1. Open **`https://<your-app>.vercel.app/setup`**.
2. (Optional) type an **org** name to install org-wide; leave blank for your account.
3. Click **🚀 Create SlopGuard App on GitHub**. GitHub creates the App with:
   - Webhook URL → `https://<your-app>.vercel.app/api/webhook`
   - Permissions → Metadata(r), Contents(r), Issues(rw), Pull requests(rw)
   - Events → `pull_request`, `issues`, `issue_comment`
4. GitHub redirects to `/api/manifest/callback`, which prints the credentials **once**:

   ```
   GITHUB_APP_ID=...
   GITHUB_APP_CLIENT_ID=...
   GITHUB_APP_CLIENT_SECRET=...
   GITHUB_WEBHOOK_SECRET=...
   GITHUB_APP_PRIVATE_KEY_BASE64=...
   ```

5. Paste all of them into **Vercel → Settings → Environment Variables**
   (Production), plus at least one LLM key (`ANTHROPIC_API_KEY` /
   `XAI_API_KEY` / `OPENAI_API_KEY`) — optional, heuristics still run without it.
6. **Redeploy**: `vercel --prod` (env changes need a new deployment).
7. Click the install link the callback page shows, or go to
   `https://github.com/apps/<your-app-slug>/installations/new`, and install on a repo.

### Manual alternative (no manifest)
Settings → Developer settings → GitHub Apps → New App. Same permissions/events
as above, webhook URL `https://<app>/api/webhook`, set a webhook secret, generate
a private key (.pem). Base64-encode the pem for `GITHUB_APP_PRIVATE_KEY_BASE64`:
`base64 -w0 your-key.pem`.

---

## C. Local development (smee.io)

```bash
cd slopguard
cp .env.example .env.local      # paste your App creds + LLM key
npm install
npm run dev                     # http://localhost:3000
```

In a second terminal, proxy GitHub webhooks to localhost:

```bash
# 1) create a channel at https://smee.io/new
SMEE_URL=https://smee.io/your-channel npm run smee
```

Point the App's webhook URL at that smee URL (App settings → Webhook) while
developing. Trigger by opening a PR/issue on a repo where the App is installed.

### Test without GitHub at all
```bash
# heuristics-only:
npx --yes tsx scripts/test-agent.ts
# with LLM blending:
node --env-file=.env.local --import tsx scripts/test-agent.ts
```

---

## Verify it's live

```bash
curl -s https://<your-app>.vercel.app/api/health
# → { "status":"ok", "githubAppConfigured":true, "llmProviders":{...} }
```

Open a test PR titled `Update` with body `As an AI language model, here's the
updated implementation. I hope this helps!` → SlopGuard should add
`slop-quarantine` + a review comment within a few seconds. Then comment
`/slop approve` (as a maintainer) to clear it.

Dashboard: `https://<your-app>.vercel.app/dashboard/<owner>/<repo>`.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Missing GitHub App env` in logs | env vars not set / not redeployed |
| Webhook 401 | `GITHUB_WEBHOOK_SECRET` mismatch between App & env |
| No comment appears | check the repo has the App installed + Issues/PR write perms |
| `/slop` ignored | commenter needs **write** access; bots are ignored |
| Dashboard "couldn't load" | App not installed on that repo |
