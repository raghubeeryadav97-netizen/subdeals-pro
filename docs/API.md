# SubDeals Pro API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password/:token` | Reset password |
| POST | `/auth/refresh-token` | Refresh JWT |
| GET | `/auth/me` | Get current user (auth) |
| PUT | `/auth/profile` | Update profile (auth) |

## Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/plans` | List plans (filters: type, category, search, featured, popular, trending) |
| GET | `/plans/:slug` | Get plan by slug |
| GET | `/plans/admin/all` | Admin list all plans |
| POST | `/plans` | Create plan (admin) |
| PUT | `/plans/:id` | Update plan (admin) |
| DELETE | `/plans/:id` | Archive plan (admin) |
| POST | `/plans/:id/duplicate` | Duplicate plan (admin) |

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List active categories |
| GET | `/categories/:slug` | Get category |
| GET | `/categories/admin/all` | Admin list |
| POST | `/categories` | Create (admin) |
| PUT | `/categories/:id` | Update (admin) |
| DELETE | `/categories/:id` | Delete (admin) |

## Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |
| GET | `/orders/my` | User orders (auth) |
| GET | `/orders/track/:orderId` | Track order |
| POST | `/orders/:id/payment-screenshot` | Upload payment proof |
| GET | `/orders/admin/all` | Admin orders |
| PUT | `/orders/:id/status` | Update status (admin) |
| GET | `/orders/:id/invoice` | Download PDF invoice |
| POST | `/orders/:id/email-invoice` | Email invoice |
| POST | `/orders/bulk-update` | Bulk update (admin) |

## Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews` | Approved reviews |
| POST | `/reviews` | Submit review |
| GET | `/reviews/admin/all` | Admin reviews |
| PUT | `/reviews/:id` | Approve/edit (admin) |
| DELETE | `/reviews/:id` | Delete (admin) |

## Coupons

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/coupons/validate` | Validate coupon code |
| GET | `/coupons/admin/all` | Admin list |
| POST | `/coupons` | Create (admin) |
| PUT | `/coupons/:id` | Update (admin) |
| DELETE | `/coupons/:id` | Delete (admin) |

## Blog

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blogs` | Published blogs |
| GET | `/blogs/:slug` | Single blog |
| GET | `/blogs/admin/all` | Admin list |
| POST | `/blogs` | Create (admin) |
| PUT | `/blogs/:id` | Update (admin) |
| DELETE | `/blogs/:id` | Delete (admin) |

## Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings/public` | Public settings |
| GET | `/settings` | All settings (admin) |
| PUT | `/settings` | Update settings (admin) |

## Dashboard & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard statistics |
| GET | `/dashboard/analytics` | Charts data |

## Other Endpoints

- `/contact` - Contact form
- `/newsletter/subscribe` - Newsletter
- `/support` - Support tickets
- `/notifications` - Notification center
- `/users/customers` - CRM
- `/upload` - File uploads
- `/seo/sitemap.xml` - XML sitemap
- `/backup` - Database backup (admin)

## Auth Header

```
Authorization: Bearer <jwt_token>
```