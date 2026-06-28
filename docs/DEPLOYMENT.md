# Deployment Guide

## Docker (Recommended)

```bash
# Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env

docker-compose up -d
docker exec subdeals-api node scripts/seed.js
```

Access: http://localhost:3000

## Render (Backend)

1. Create Web Service from `backend/` directory
2. Build: `npm install`
3. Start: `npm start`
4. Add environment variables from `.env.example`
5. Add MongoDB Atlas connection string

## Vercel (Frontend)

1. Import `frontend/` directory
2. Framework: Vite
3. Build: `npm run build`
4. Output: `dist`
5. Set `VITE_API_URL` to your backend URL
6. Update `vercel.json` rewrite destination

## Railway

1. Deploy backend with `backend/Dockerfile`
2. Add MongoDB plugin
3. Set all env variables
4. Deploy frontend separately or use Docker Compose

## VPS with Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/subdeals/dist;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
    }

    location /uploads {
        proxy_pass http://127.0.0.1:5000;
    }

    location /socket.io {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Firebase Hosting

```bash
cd frontend && npm run build
firebase init hosting
# Set public directory to dist
firebase deploy
```

## Post-Deployment Checklist

- [ ] Run seed script or create admin user
- [ ] Configure SMTP for emails
- [ ] Set WhatsApp Cloud API credentials
- [ ] Configure Razorpay/Stripe keys
- [ ] Set up Cloudinary for uploads
- [ ] Enable HTTPS
- [ ] Configure CORS `FRONTEND_URL`
- [ ] Test purchase flow end-to-end