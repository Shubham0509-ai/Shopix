# 🛍️ Shopix - Modern E-Commerce Platform

A production-ready, full-stack E-Commerce web application built with the **MERN** stack (MongoDB, Express, React, Node.js), powered by **Vite**, **Tailwind CSS**, **Redis**, **Stripe**, and **Cloudinary**.

---

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication** with dual-token architecture (Access Token + Refresh Token).
- Secure, **HttpOnly, SameSite cookies** to prevent XSS and CSRF vulnerabilities.
- **Token Rotation & Invalidation** via **Redis** cache.
- Role-based authorization: **Customer** and **Admin** access guards.

### 📦 Product Management & Catalog
- **Product Catalog** with category filtering and pagination/sampling.
- **Admin Dashboard**: Create, view, toggle featured status, and delete products.
- **Image Management**: Seamless image uploads and automated cleanup using **Cloudinary**.
- **Performance Caching**: High-speed **Redis caching** for featured products.
- **Smart Recommendations**: MongoDB `$sample` aggregation for related product discovery.

### 🛒 Cart & Checkout
- Persistent cart state managed via **Zustand** on the frontend and synced with **MongoDB**.
- Dynamic quantity adjustment and item removal.
- **Stripe Checkout Integration**: Secure checkout sessions with card processing.
- Order history and idempotency protection against duplicate order creation.

### 🎟️ Coupons & Discounts
- **Gift Coupons**: Automatically generates dynamic 10% discount coupons for purchases over \$200.
- Real-time coupon validation with expiration date and usage enforcement.
- Automated discount calculation applied directly to Stripe checkout sessions.

### 📊 Analytics & Reporting (Admin Only)
- Comprehensive analytics powered by MongoDB aggregation pipelines.
- Total users, products, sales, and gross revenue metrics.
- Interactive 7-day daily sales and revenue charts built with **Recharts**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons & UI:** [Lucide React](https://lucide.dev/), [React Hot Toast](https://react-hot-toast.com/), [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Recharts](https://recharts.org/)
- **Payments:** [@stripe/stripe-js](https://stripe.com/docs/js) & [@stripe/react-stripe-js](https://stripe.com/docs/stripe-js/react)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework:** [Express 5](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Caching:** [Redis](https://redis.io/) via [ioredis](https://github.com/redis/ioredis) (Upstash Redis)
- **Payments:** [Stripe Node SDK](https://github.com/stripe/stripe-node)
- **Cloud Storage:** [Cloudinary SDK](https://cloudinary.com/)
- **Authentication:** [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) & [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

## 📂 Project Structure

```text
Shopix/
├── backend/
│   ├── controllers/         # Business logic (auth, product, cart, coupon, payment, analytics)
│   ├── lib/                 # Utility libraries (cloudinary, db, redis, stripe)
│   ├── middlewares/         # Route protection (verifyJWT, adminRoute)
│   ├── models/              # Mongoose data schemas (User, Product, Order, Coupon)
│   ├── routes/              # Express API route declarations
│   ├── utils/               # Helper classes (ApiError, ApiResponse, asyncHandler)
│   └── server.js            # Express app entry point & static file serving
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI widgets, modals, and navbar
│   │   ├── lib/             # Axios instance & frontend utilities
│   │   ├── pages/           # View routes (Home, Login, Signup, Cart, Admin, Success, Cancel)
│   │   ├── stores/          # Zustand state stores (useUserStore, useProductStore, useCartStore)
│   │   ├── App.jsx          # Route configuration
│   │   └── main.jsx         # App mounting
│   ├── package.json
│   └── vite.config.js
├── package.json             # Root package scripts for fullstack orchestration
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=your_mongodb_connection_string

# Redis (Upstash)
REDIS_URL=rediss://default:your_token@your_host.upstash.io:6379

# JWT Secrets
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

---

## 💻 Local Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance
- [Upstash Redis](https://upstash.com/) account
- [Cloudinary](https://cloudinary.com/) account
- [Stripe](https://stripe.com/) account (Test mode)

### 1. Clone the repository
```bash
git clone https://github.com/Shubham0509-ai/Shopix.git
cd Shopix
```

### 2. Install dependencies
```bash
# Install root/backend dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Setup environment variables
Create a `.env` file in the root directory following the [Environment Variables](#️-environment-variables) section above.

### 4. Run in development mode
You can run the backend and frontend simultaneously:

**Terminal 1 (Backend):**
```bash
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
npm run dev --prefix frontend
# Client runs on http://localhost:5173
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens | Public |
| `POST` | `/api/auth/logout` | Invalidate refresh token & clear cookies | Authenticated |
| `POST` | `/api/auth/refresh-token` | Rotate access token using refresh token | Public |
| `GET` | `/api/auth/profile` | Retrieve authenticated user profile | Authenticated |

### 📦 Products (`/api/products`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all products | Admin |
| `GET` | `/api/products/featured` | Retrieve featured products (Redis cached) | Public |
| `GET` | `/api/products/recommendations` | Retrieve random recommended products | Public |
| `GET` | `/api/products/category/:category` | Retrieve products by category | Public |
| `POST` | `/api/products` | Create product with image upload | Admin |
| `PATCH`| `/api/products/:id` | Toggle product featured status | Admin |
| `DELETE`| `/api/products/:id` | Delete product and Cloudinary image | Admin |

### 🛒 Cart (`/api/cart`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Get current user's cart items | Authenticated |
| `POST` | `/api/cart` | Add product to cart | Authenticated |
| `DELETE`| `/api/cart` | Remove item(s) from cart | Authenticated |
| `PUT` | `/api/cart/:id` | Update product quantity | Authenticated |

### 🎟️ Coupons (`/api/coupon`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/coupon` | Fetch user's active coupon | Authenticated |
| `POST` | `/api/coupon/validate` | Validate coupon code | Authenticated |

### 💳 Payments (`/api/payment`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payment/create-checkout-session` | Initialize Stripe checkout session | Authenticated |
| `POST` | `/api/payment/checkout-success` | Confirm order creation & deactivate coupon | Authenticated |

### 📊 Analytics (`/api/analytics`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics` | Fetch total and 7-day sales/revenue metrics | Admin |

---

## 🚢 Deployment (Render)

This repository is pre-configured for single-service full-stack deployment on **Render**:

1. Create a new **Web Service** on [Render](https://dashboard.render.com).
2. Connect your GitHub repository.
3. Configure the build parameters:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Add all required **Environment Variables** in the Render dashboard. Set `NODE_ENV=production` and `CLIENT_URL=https://<your-service>.onrender.com`.
5. Whitelist `0.0.0.0/0` in **MongoDB Atlas Network Access** to permit Render's dynamic IP connections.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
