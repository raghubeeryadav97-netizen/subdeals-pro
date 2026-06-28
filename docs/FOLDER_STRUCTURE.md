# Folder Structure

```
SubDeals-Pro/
├── README.md
├── docker-compose.yml
│
├── frontend/
│   ├── public/              # Static assets, PWA icons
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Reusable UI components
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   ├── home/
│   │   │   ├── layout/
│   │   │   ├── plans/
│   │   │   └── reviews/
│   │   ├── hooks/
│   │   ├── i18n/            # Multi-language
│   │   ├── pages/           # Route pages
│   │   │   └── admin/       # Admin panel pages
│   │   ├── store/           # Redux slices
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json
│   └── package.json
│
├── backend/
│   ├── config/              # DB, Cloudinary config
│   ├── controllers/         # Route handlers (MVC)
│   ├── cron/                # Scheduled jobs
│   ├── middleware/          # Auth, upload, errors
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Helpers
│   ├── scripts/             # Seed, backup
│   ├── uploads/             # Local file storage
│   ├── logs/                # Winston logs
│   ├── backups/             # MongoDB backups
│   ├── server.js            # Entry point
│   └── package.json
│
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    ├── ENVIRONMENT.md
    └── FOLDER_STRUCTURE.md
```