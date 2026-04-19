# ☕ BrewHaven Café — Full-Stack Ordering System

A production-ready café ordering web application with a customer-facing storefront and a secure admin panel.

---

## 🗂 Project Structure

```
cafe-app/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── errorHandler.js
│   │   └── upload.js         # Multer/Cloudinary
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   └── orders.js
│   ├── utils/
│   │   └── cloudinary.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                 # React App
    ├── public/
    └── src/
        ├── components/
        │   ├── admin/        # Admin-only components
        │   ├── customer/     # Customer-facing components
        │   └── shared/       # Reusable UI components
        ├── pages/
        │   ├── admin/        # Admin pages
        │   └── customer/     # Customer pages
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   └── ThemeContext.jsx
        ├── hooks/            # Custom React hooks
        ├── services/         # API call functions
        ├── utils/            # Helpers & formatters
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18, Vite, React Router v6     |
| Styling     | Tailwind CSS + custom CSS variables |
| State       | React Context API                   |
| Backend     | Node.js, Express 4                  |
| Database    | MongoDB + Mongoose                  |
| Auth        | JWT (jsonwebtoken + bcryptjs)        |
| Images      | Cloudinary (or local fallback)      |
| Deployment  | Render (backend) + Vercel (frontend)|

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (optional — local upload works too)

---

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/cafe-app.git
cd cafe-app

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2. Environment Variables

#### Backend — `backend/.env`

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/cafe-app

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS origin
CLIENT_URL=http://localhost:5173

# Admin seed
ADMIN_EMAIL=admin@brewhaven.com
ADMIN_PASSWORD=Admin@1234
```

#### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

### 3. Seed the Database

```bash
cd backend
node utils/seed.js
```

This creates:
- An admin user (`admin@brewhaven.com` / `Admin@1234`)
- Sample menu items across 4 categories

---

### 4. Run the App

```bash
# Terminal 1 — Backend (from /backend)
npm run dev

# Terminal 2 — Frontend (from /frontend)
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Admin Panel: `http://localhost:5173/admin`

---

## 🔐 Admin Credentials (after seeding)

```
Email:    admin@brewhaven.com
Password: Admin@1234
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Description        | Auth     |
|--------|--------------------|--------------------|----------|
| POST   | /api/auth/login    | Admin login        | Public   |
| POST   | /api/auth/logout   | Logout             | Admin    |
| GET    | /api/auth/me       | Get current user   | Admin    |

### Menu
| Method | Endpoint           | Description        | Auth     |
|--------|--------------------|--------------------|----------|
| GET    | /api/menu          | Get all items      | Public   |
| GET    | /api/menu/:id      | Get single item    | Public   |
| POST   | /api/menu          | Create item        | Admin    |
| PUT    | /api/menu/:id      | Update item        | Admin    |
| DELETE | /api/menu/:id      | Delete item        | Admin    |

### Orders
| Method | Endpoint                      | Description        | Auth     |
|--------|-------------------------------|--------------------|----------|
| POST   | /api/orders                   | Place order        | Public   |
| GET    | /api/orders                   | Get all orders     | Admin    |
| GET    | /api/orders/:id               | Get single order   | Admin    |
| PUT    | /api/orders/:id/status        | Update status      | Admin    |
| GET    | /api/orders/analytics/summary | Dashboard stats    | Admin    |

---

## 🌍 Deployment

### Backend — Render

1. Push backend to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env`

### Frontend — Vercel

1. Push frontend to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-render-app.onrender.com/api`
5. Deploy!

---

## ✨ Features

### Customer
- 🍕 Browse menu by category
- 🔍 Search & filter items
- 🛒 Add to cart, update quantities
- 📝 Checkout with name, phone, notes
- ✅ Order confirmation page
- 🌙 Dark / Light mode

### Admin
- 🔒 Secure JWT login
- ➕ Add / edit / delete menu items
- 📦 View all orders with status
- 🔄 Update order status (pending → preparing → completed)
- 📊 Dashboard analytics (revenue, order counts)
- 🖼️ Image upload via Cloudinary

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection error | Check `MONGO_URI` in `.env` |
| JWT errors | Ensure `JWT_SECRET` is set |
| Images not uploading | Verify Cloudinary credentials |
| CORS errors | Set `CLIENT_URL` to your frontend URL |

---

## 📄 License

MIT — free to use and modify.

---

> Built with ❤️ for the love of great coffee.
