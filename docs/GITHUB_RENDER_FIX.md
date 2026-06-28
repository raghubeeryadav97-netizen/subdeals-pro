# Render — "No repositories found" FIX

## Problem
Render ko GitHub par koi repo nahi dikh raha.

## Solution — 2 Parts

---

## PART A: Pehle GitHub par Repo Banao (ZAROORI)

### Step 1 — GitHub account
https://github.com/login
(Same email use karo jo Render par hai — optional but helpful)

### Step 2 — Naya repo banao
1. https://github.com/new
2. Repository name: `subdeals-pro`
3. **Public** select karo (free Render ke liye easy)
4. **Create repository** (README mat add karo)

### Step 3 — Code upload karo
1. Naye repo page par **"uploading an existing file"** link click karo
2. Ye ZIP extract karo pehle:
   `C:\Users\user\SubDeals-Pro-Upload.zip`
3. Extract ki hui **saari folders** drag-drop karo:
   - `backend` folder
   - `frontend` folder
   - `docs` folder
   - `scripts` folder
   - `firebase.json`
   - `render.yaml`
   - `README.md`
   - etc.
4. **node_modules** folders MAT daalna
5. Neeche **Commit changes** click karo

Ab repo live: `https://github.com/YOUR_USERNAME/subdeals-pro`

---

## PART B: Render ko GitHub Access Do

### Step 1 — Render par GitHub connect
1. Render dashboard → **New +** → **Web Service**
2. **Git Provider** section mein **GitHub** click karo
3. **Configure account** ya **Connect GitHub** click karo
4. Browser popup → **Authorize Render** click karo
5. GitHub login karo agar maange

### Step 2 — Repository access (IMPORTANT)
GitHub par redirect hoga ya popup mein:

1. **"Only select repositories"** choose karo
2. Dropdown se **`subdeals-pro`** select karo
3. **Approve & Install** / **Save** click karo

YA agar pehle se connected hai:
1. https://github.com/settings/installations
2. **Render** find karo → **Configure**
3. **Repository access** → **Only select repositories**
4. **`subdeals-pro`** add karo → **Save**

### Step 3 — Render refresh
1. Render page par wapas jao
2. **Refresh** ya page reload karo
3. Ab **`subdeals-pro`** repo dikhna chahiye

---

## PART C: Web Service Settings

| Field | Value |
|-------|--------|
| Name | subdeals-api |
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Plan | **Free** |

### Environment Variables:
```
MONGODB_URI = mongodb+srv://...
FRONTEND_URL = https://subdeals-696aa.web.app
NODE_ENV = production
JWT_SECRET = subdeals-jwt-secret-2026
JWT_REFRESH_SECRET = subdeals-refresh-2026
```

**Create Web Service** → Deploy

---

## Still not showing?

| Check | Fix |
|-------|-----|
| Repo private hai | GitHub Settings → Render app → repo access add karo |
| Galat GitHub account | Render → Account Settings → disconnect/reconnect GitHub |
| Repo empty hai | GitHub par files upload karo (Part A) |
| Org repo hai | Org admin se Render access approve karwao |