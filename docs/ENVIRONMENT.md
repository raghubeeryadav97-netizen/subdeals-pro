# Environment Variables Guide

## Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | Yes | Server port (default: 5000) |
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | JWT signing secret |
| JWT_REFRESH_SECRET | Yes | Refresh token secret |
| FRONTEND_URL | Yes | Frontend URL for CORS |
| BASE_URL | Yes | Backend public URL |
| CLOUDINARY_* | No | Cloudinary upload credentials |
| SMTP_* | No | Email configuration |
| WHATSAPP_CLOUD_API_TOKEN | No | Meta WhatsApp API token |
| WHATSAPP_PHONE_NUMBER_ID | No | WhatsApp phone number ID |
| RAZORPAY_KEY_* | No | Razorpay payment keys |
| STRIPE_* | No | Stripe payment keys |
| ADMIN_WHATSAPP | Yes | Admin WhatsApp for orders |
| ADMIN_EMAIL | Yes | Admin notification email |

## Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_API_URL | Yes | Backend API URL |
| VITE_SOCKET_URL | No | Socket.io server URL |

## Security Notes

- Use strong random strings for JWT secrets (32+ chars)
- Never commit `.env` files
- Use HTTPS in production
- Rotate secrets periodically