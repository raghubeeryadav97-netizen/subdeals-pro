# SubDeals Pro

Enterprise-grade SaaS platform for selling Premium Entertainment and AI Subscription Plans.

## Features

- Premium luxury UI with dark/light mode, glassmorphism, animations
- Unlimited plans & categories (admin-managed, no code changes)
- WhatsApp purchase flow with order generation
- Payment: UPI, QR, Bank Transfer, Razorpay, Stripe, Manual
- Full admin panel with analytics, CRM, coupons, blog
- Email & WhatsApp automation (Meta Cloud API)
- Subscription expiry reminders (node-cron)
- PDF invoices, backup system, PWA support
- Multi-language (English, Hindi)
- Referral & loyalty systems

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19, Vite, Tailwind CSS | Node.js, Express.js |
| Redux Toolkit, Framer Motion | MongoDB, Mongoose |
| React Router, Socket.io Client | JWT, Socket.io, node-cron |

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+
- (Optional) Cloudinary, SMTP, WhatsApp Cloud API keys

### 1. Clone & Install

```bash
cd SubDeals-Pro

# Backend
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run seed
npm run dev

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install --legacy-peer-deps
npm run dev
```

### 2. Access

| URL | Credentials |
|-----|-------------|
| Website | http://localhost:5173 |
| API | http://localhost:5000/api |
| Admin | admin@subdealspro.com / Admin@123 |

## Project Structure

```
SubDeals-Pro/
├── frontend/          # React 19 + Vite
├── backend/           # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── cron/
│   └── scripts/
├── docs/              # API & deployment docs
├── docker-compose.yml
└── README.md
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all required variables.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel, Render, Railway, Docker, and VPS guides.

## API Documentation

See [docs/API.md](docs/API.md)

## License

Proprietary - SubDeals Pro