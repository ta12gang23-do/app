# app

Minimal starter project connected to **GitHub**, **Vercel** and **Supabase**.

| Service | Details |
| --- | --- |
| GitHub | `ta12gang23-do/app` (SSH alias: `github-ta12gang23`) |
| Vercel | Project `app` (team `app-d14d`) |
| Supabase | Project `app` (`fbkqrofccwtwpsulbqbq`, region `ap-south-1`) |

## Local development

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

`config.js` contains the Supabase URL and the public anon key. The anon key is
safe to expose in client-side code; protect data with Row Level Security (RLS).

## Deploy

```powershell
vercel deploy --token $env:VERCEL_TOKEN --scope app-d14d --project app --prod --yes
```

## Push

```powershell
git push origin main
```

Remote uses the dedicated SSH key:

```
Host github-ta12gang23
  HostName github.com
  IdentityFile ~/.ssh/id_ed25519_ta12gang23
```
