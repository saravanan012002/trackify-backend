# Deploy Trackify backend on Render (free)

## 1. MongoDB Atlas (free database)
1. Create an account at https://www.mongodb.com/cloud/atlas and create a free **M0** cluster.
2. **Database Access** → Add Database User (username + password). Avoid special characters in the password (or URL-encode them).
3. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`). Render's free tier has no fixed IP.
4. **Connect → Drivers** → copy the connection string and add the database name `trackify`:

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/trackify?retryWrites=true&w=majority
```

## 2. Push the backend to GitHub
Create a new repo and push the **contents of this folder** (so `server.js` and `package.json` are at the repo root).

```bash
git init
git add .
git commit -m "Trackify backend"
git branch -M main
git remote add origin https://github.com/YOUR_USER/trackify-backend.git
git push -u origin main
```

## 3. Create the service on Render
**Option A – Blueprint (uses `render.yaml`)**
Render dashboard → New → **Blueprint** → select the repo → it asks for `MONGO_URI` → paste the Atlas string → Apply.

**Option B – Manual**
Render dashboard → New → **Web Service** → select the repo, then:

| Setting        | Value           |
|----------------|-----------------|
| Runtime        | Node            |
| Build Command  | `npm install`   |
| Start Command  | `npm start`     |
| Instance type  | Free            |
| Health Check   | `/api/health`   |
| Environment    | `MONGO_URI` = your Atlas string, `NODE_ENV` = `production` |

Do **not** set `PORT` – Render provides it and `server.js` already reads it.

## 4. Test
Open `https://YOUR-SERVICE.onrender.com/api/health` → should return `{"success":true,"status":"OK"}`.
In the Postman collection, set the `baseUrl` variable to your Render URL and run the suite.

## Good to know
- **Free tier sleeps** after ~15 min idle; the next request takes ~30–60 s. The Flutter app handles this (70 s timeout and a friendly splash message). To avoid it, ping `/api/health` every 5–10 min with a free monitor such as UptimeRobot.
- **No authentication**: anyone who knows your URL can read and change your data. Fine for testing, but before sharing the URL widely, add an API key or login.
- Default categories are seeded automatically by the app on first launch (`POST /api/categories/seed/defaults`).

## Changes made to the original backend
- Added `render.yaml`, `engines` in `package.json`.
- Duplicate records (same salary month, same category name/type) now return **409 "This record already exists"** instead of a generic 500.
- Search text is regex-escaped, so searching for `(` or `*` no longer causes a 500.
