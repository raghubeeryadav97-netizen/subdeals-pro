# Firebase Deployment Guide

## Prerequisites

1. [Firebase CLI](https://firebase.google.com/docs/cli) installed (`firebase --version`)
2. Google account
3. [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster (required for production)

---

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add project** → Name: `subdeals-pro`
3. Copy your Project ID

Update `.firebaserc` if project ID is different:
```json
{
  "projects": {
    "default": "YOUR-PROJECT-ID"
  }
}
```

---

## Step 2: MongoDB Atlas (Free)

1. Create free M0 cluster at https://cloud.mongodb.com
2. Database Access → Add user (username + password)
3. Network Access → Add IP → **Allow Access from Anywhere** (0.0.0.0/0)
4. Connect → Get connection string:
```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/subdeals-pro?retryWrites=true&w=majority
```

---

## Step 3: Firebase Login

```bash
firebase login
```

---

## Step 4: Set Secrets

```bash
cd C:\Users\user\SubDeals-Pro

firebase functions:secrets:set MONGODB_URI
# Paste your MongoDB Atlas connection string

firebase functions:secrets:set JWT_SECRET
# Enter a long random string (32+ chars)

firebase functions:secrets:set JWT_REFRESH_SECRET
# Enter another long random string
```

---

## Step 5: Deploy

**Option A — Script:**
```bat
C:\Users\user\SubDeals-Pro\scripts\firebase-deploy.bat
```

**Option B — Manual:**
```bash
cd frontend && npm run build && cd ..
cd backend && npm install && cd ..
firebase deploy
```

---

## Step 6: Seed Production Database

After first deploy, run seed locally pointing to Atlas:

```bash
cd backend
# Set MONGODB_URI in .env to your Atlas URI
npm run seed
```

---

## Your Live URLs

After deploy:
- **Website:** `https://subdeals-pro.web.app` or `https://subdeals-pro.firebaseapp.com`
- **API:** `https://subdeals-pro.web.app/api/health`

---

## Architecture

```
Firebase Hosting (frontend/dist)
    ├── /          → React SPA
    ├── /api/**    → Cloud Function (Express API)
    └── /uploads/** → Cloud Function
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Deploy fails - no project | Create project in Firebase Console, update `.firebaserc` |
| API 500 error | Check `MONGODB_URI` secret is set correctly |
| CORS error | `FRONTEND_URL` auto-set by Firebase hosting URL |
| Functions timeout | Increase timeout in `backend/index.js` |

---

## Admin Login (after seed)

- Email: `admin@subdealspro.com`
- Password: `Admin@123`