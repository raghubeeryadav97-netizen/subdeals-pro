# SubDeals Pro — 100% Free Deployment

## Stack (All Free)

| Service | Purpose | Cost |
|---------|---------|------|
| **Firebase Hosting** | Frontend website | Free |
| **Render.com** | Backend API | Free |
| **MongoDB Atlas M0** | Database | Free |

**Live site:** https://subdeals-696aa.web.app

---

## Step 1: MongoDB Atlas (Free Database) — 5 min

1. Open https://www.mongodb.com/cloud/atlas/register
2. Create **FREE M0** cluster
3. **Database Access** → Add user (username + password)
4. **Network Access** → Add IP → **Allow from anywhere** (0.0.0.0/0)
5. **Connect** → Drivers → Copy connection string:
```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/subdeals-pro?retryWrites=true&w=majority
```

---

## Step 2: Render API (Free Backend) — 10 min

1. Open https://render.com → Sign up (free)
2. **New +** → **Blueprint** → Connect GitHub OR **Web Service**
3. If manual Web Service:
   - Upload/connect repo OR use Render Dashboard
   - **Root Directory:** `backend`
   - **Build:** `npm install`
   - **Start:** `node server.js`
   - **Plan:** Free

4. **Environment Variables** (add in Render dashboard):
```
NODE_ENV=production
FRONTEND_URL=https://subdeals-696aa.web.app
MONGODB_URI=mongodb+srv://YOUR_ATLAS_URI
JWT_SECRET=any-long-random-string-32chars
JWT_REFRESH_SECRET=another-long-random-string
ADMIN_WHATSAPP=919876543210
```

5. Deploy → Copy your API URL:
```
https://subdeals-api.onrender.com
```

---

## Step 3: Seed Database

On your PC (with Atlas URI in backend/.env):
```bash
cd backend
# .env mein MONGODB_URI = Atlas connection string
npm run seed
```

---

## Step 4: Update Frontend API URL

Edit `frontend/.env.production`:
```
VITE_API_URL=https://subdeals-api.onrender.com/api
```

Rebuild & redeploy Firebase:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## Step 5: Done!

| URL | Purpose |
|-----|---------|
| https://subdeals-696aa.web.app | Your live website |
| https://subdeals-api.onrender.com/api/health | API health check |

**Admin:** admin@subdealspro.com / Admin@123

---

## Free Tier Limits

- **Render:** Sleeps after 15 min inactive (first visit slow ~30 sec)
- **MongoDB Atlas:** 512MB storage (enough for thousands of orders)
- **Firebase Hosting:** 10GB/month bandwidth

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Plans not loading | Check Render API URL in `.env.production` |
| CORS error | `FRONTEND_URL` in Render = `https://subdeals-696aa.web.app` |
| API slow first time | Render free tier wakes up — wait 30 seconds |
| Login fails | Run `npm run seed` with Atlas URI |