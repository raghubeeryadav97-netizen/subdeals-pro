# Render par Deploy (Vercel ki zaroorat NAHI)

## Pehle MongoDB Atlas (Free) — 5 minute

1. https://cloud.mongodb.com → Sign up (Google se bhi ho sakta hai)
2. **Build a Database** → **FREE M0** → Create
3. **Database Access** → Add User → username/password banao
4. **Network Access** → **Add IP** → **Allow Access from Anywhere**
5. **Database** → **Connect** → **Drivers** → connection string copy:
```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/subdeals-pro
```
`<password>` ko apne password se replace karo.

---

## Render par API Deploy (Browser se — Login easy)

### Step 1: GitHub par code daalo

1. https://github.com/new → Repository name: `subdeals-pro` → **Create**
2. **uploading an existing file** click karo
3. `C:\Users\user\SubDeals-Pro` folder ki **saari files** drag-drop karo
   - `node_modules` folders **mat** daalna (bahut badi hain)
   - Sirf source code, frontend/dist, backend (without node_modules)
4. **Commit changes**

### Step 2: Render par service banao

1. https://render.com → **Get Started** (GitHub se sign up — easy login)
2. **New +** → **Web Service**
3. **Connect GitHub** → `subdeals-pro` repo select karo
4. Settings:

| Field | Value |
|-------|--------|
| Name | `subdeals-api` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Plan | **Free** |

5. **Environment Variables** add karo:

```
MONGODB_URI = (Atlas connection string)
FRONTEND_URL = https://subdeals-696aa.web.app
NODE_ENV = production
JWT_SECRET = subdeals-jwt-secret-2026-random
JWT_REFRESH_SECRET = subdeals-refresh-secret-2026
ADMIN_WHATSAPP = 919876543210
```

6. **Create Web Service** → Deploy start (5-10 min)

7. URL milega jaise: `https://subdeals-api.onrender.com`

### Step 3: Test API

Browser mein kholo:
```
https://subdeals-api.onrender.com/api/health
```
Dikhna chahiye: `{"success":true,"message":"SubDeals Pro API is running"}`

### Step 4: Mujhe Render URL bhejo

Main frontend connect kar dunga aur Firebase redeploy kar dunga.

---

## Admin Login (live site par)

Jab API live ho jayega:
- Website: https://subdeals-696aa.web.app/login
- Email: `admin@subdealspro.com`
- Password: `Admin@123`

Pehli baar API start par database auto-seed hoga.