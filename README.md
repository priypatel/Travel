# TravelAI — AI-Powered Travel Discovery Platform

An AI-powered travel discovery platform built with the MERN stack. Get personalized destination recommendations, explore curated places, restaurants, and stays, save favorites to your wishlist, and plan your perfect trip with Google Gemini AI.

**Live Demo:** (https://travel-hazel-phi.vercel.app)

---

## Features

- **AI Travel Planner** — Enter your preferences (location, budget, trip length, style) and get a full AI-generated itinerary powered by Google Gemini
- **Destination Explorer** — Browse 20+ destinations with hero images, top places, restaurants, and property stays
- **Interactive Map** — Visual map of all places within a destination using Leaflet
- **Wishlist** — Save and manage favourite destinations (requires account)
- **User Profiles** — Edit name, change password, view wishlist count
- **Admin Panel** — Full CRUD management for destinations, places, restaurants, and stays
- **JWT Auth** — Secure login with HttpOnly cookies, access + refresh token rotation
- **Redis Caching** — AI results cached via Upstash Redis to avoid redundant Gemini calls

---

## Tech Stack

| Layer      | Technologies                                                |
| ---------- | ----------------------------------------------------------- |
| Frontend   | React 19, Vite, TailwindCSS, Redux Toolkit, React Router v7 |
| Backend    | Node.js, Express 5, Mongoose                                |
| Database   | MongoDB Atlas                                               |
| AI         | Google Gemini 2.5 Flash (`@google/generative-ai`)           |
| Cache      | Upstash Redis                                               |
| Auth       | JWT (HttpOnly cookies, 15 min access / 7 day refresh)       |
| Forms      | Formik + Yup                                                |
| Maps       | Leaflet + OpenStreetMap                                     |
| Deployment | Vercel (frontend), Render (backend)                         |

---

## Project Structure

```
travel-ai-app/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios API functions
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── store/           # Redux slices & store
│   │   └── validators/      # Yup schemas
│   └── vercel.json          # SPA rewrite rules
│
├── server/                  # Node.js + Express backend
│   └── src/
│       ├── controllers/     # Route handlers
│       ├── middleware/      # Auth, error, validation
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routes
│       ├── services/        # Gemini + Redis services
│       ├── utils/           # AppError, asyncHandler
│       └── seed.js          # DB seed script
│
└── package.json             # Root: runs both apps via concurrently
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- Upstash Redis account (optional — app degrades gracefully)

### 1. Clone the repo

```bash
git clone https://github.com/priypatel/travel-ai-app.git
cd travel-ai-app
```

### 2. Install dependencies

```bash
npm install          # installs root + both client and server
```

Or separately:

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Configure environment variables

**`server/.env`**

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
REDIS_URL=https://your-upstash-redis-url
REDIS_TOKEN=your_upstash_redis_token
```

**`client/.env`**

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Seed the database

```bash
cd server
node src/seed.js
```

This populates 20+ destinations with places, restaurants, and stays.

### 5. Run the app

```bash
# From project root — starts both client and server
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## API Reference

All endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint         | Access    | Description          |
| ------ | ---------------- | --------- | -------------------- |
| POST   | `/auth/register` | Public    | Create account       |
| POST   | `/auth/login`    | Public    | Login                |
| POST   | `/auth/refresh`  | Public    | Refresh access token |
| POST   | `/auth/logout`   | Public    | Clear cookies        |
| GET    | `/auth/me`       | Protected | Get current user     |
| PUT    | `/auth/me`       | Protected | Update name/password |

### Destinations

| Method | Endpoint                        | Access | Description                |
| ------ | ------------------------------- | ------ | -------------------------- |
| GET    | `/destinations`                 | Public | List all destinations      |
| GET    | `/destinations/:id`             | Public | Destination details        |
| GET    | `/destinations/:id/places`      | Public | Places in destination      |
| GET    | `/destinations/:id/restaurants` | Public | Restaurants in destination |
| GET    | `/destinations/:id/stays`       | Public | Stays in destination       |

### AI

| Method | Endpoint                | Access | Description             |
| ------ | ----------------------- | ------ | ----------------------- |
| POST   | `/ai/recommend`         | Public | Get AI recommendation   |
| GET    | `/ai/destination/:slug` | Public | Fetch AI result by slug |

**AI request body:**

```json
{
  "location": "India",
  "budget": "mid-range",
  "days": 5,
  "style": "adventure",
  "interests": ["hiking", "culture"]
}
```

### Wishlist

| Method | Endpoint        | Access    | Description            |
| ------ | --------------- | --------- | ---------------------- |
| GET    | `/wishlist`     | Protected | Get saved destinations |
| POST   | `/wishlist/add` | Protected | Add to wishlist        |
| DELETE | `/wishlist/:id` | Protected | Remove from wishlist   |

### Admin (admin role required)

| Method     | Endpoint                                            | Description                 |
| ---------- | --------------------------------------------------- | --------------------------- |
| GET/POST   | `/admin/destinations`                               | List / Create destination   |
| PUT/DELETE | `/admin/destinations/:id`                           | Update / Delete destination |
| GET/POST   | `/admin/destinations/:id/places`                    | List / Create place         |
| PUT/DELETE | `/admin/destinations/:id/places/:placeId`           | Update / Delete place       |
| GET/POST   | `/admin/destinations/:id/restaurants`               | List / Create restaurant    |
| PUT/DELETE | `/admin/destinations/:id/restaurants/:restaurantId` | Update / Delete restaurant  |
| GET/POST   | `/admin/destinations/:id/stays`                     | List / Create stay          |
| PUT/DELETE | `/admin/destinations/:id/stays/:stayId`             | Update / Delete stay        |

---

## Pages

| Route               | Description                                 |
| ------------------- | ------------------------------------------- |
| `/`                 | Home — hero, destination grid, month filter |
| `/destinations/:id` | Destination detail — hero, map, top 5 lists |
| `/ai-search`        | AI planner form                             |
| `/ai-destination`   | AI-generated itinerary result               |
| `/wishlist`         | Saved destinations (login required)         |
| `/profile`          | User profile and settings (login required)  |
| `/admin`            | Admin panel (admin role required)           |
| `/login`            | Login                                       |
| `/register`         | Register                                    |

---

## Deployment

### Frontend — Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set root directory to `client`
4. Add environment variable: `VITE_API_BASE_URL=https://your-render-url.onrender.com`
5. Deploy — `vercel.json` handles SPA routing automatically

### Backend — Render

1. Create a new **Web Service** pointing to the repo
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node src/index.js`
5. Add all environment variables from `server/.env`
6. Set `CLIENT_URL=https://your-vercel-url.vercel.app` (no trailing slash)

---

## Creating an Admin User

Admin accounts can only be created directly in the database — there is no public registration for admins.

```javascript
// In MongoDB shell or Compass
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } });
```

---

## Design System

| Token      | Value              |
| ---------- | ------------------ |
| Primary    | `#4F46E5` (Indigo) |
| Accent     | `#06B6D4` (Cyan)   |
| Background | `#F8FAFC`          |
| Dark       | `#0F172A`          |
| Font       | Inter              |
| Max width  | 1200px             |

---

## License

MIT — feel free to use this project for learning or as a starter template.

---

Built by [Priy Patel](https://github.com/priypatel)
