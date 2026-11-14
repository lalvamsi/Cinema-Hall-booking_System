# 🎬 CinePass - Cinema Hall Ticket Booking System (MERN Stack)

A modern, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** Cinema Hall and Multiplex Ticket Booking System.

Features an interactive visual seat selection matrix (VIP Recliner, Executive Gold, and Classic Silver tiers), date and showtime selection across multiple cinema screens (IMAX 3D, Dolby Atmos 4K), checkout with price calculations, and digital printable e-tickets with verifiable QR codes.

---

## ✨ Features

- **🎥 Movie Catalog**:
  - Browse "Now Showing" and "Coming Soon" blockbusters.
  - Filter by genre (*Sci-Fi, Action, Drama, Animation, Adventure, Crime*).
  - Search movies in real-time by title, cast, or genre.
  - Rich movie profiles with synopsis, director, cast, runtime, certificate (*UA, A, U*), and ratings.

- **💺 Interactive Cinema Hall Seat Matrix**:
  - Curved Cinema Screen with ambient projection glow (`All Eyes This Way`).
  - Tiered seating arrangement:
    - 👑 **VIP / Platinum Recliners**: Rows A & B (₹350)
    - ⭐ **Executive Gold**: Rows C, D & E (₹250)
    - 🎟️ **Classic Silver**: Rows F, G & H (₹180)
  - Real-time seat status: **Available**, **Selected**, and **Occupied / Booked**.
  - Realistic multi-block layout with walkway aisles (Left, Center, Right).
  - Dynamic seat counter, tier breakdown, and live total calculation.

- **📅 Showtime & Screen Scheduling**:
  - Date selector for today and upcoming dates.
  - Multi-screen scheduling (*Audi 1 - Dolby Atmos 4K, Audi 2 - IMAX Laser 3D, Audi 3 - VIP Luxe Recliner*).
  - Live seat availability indicators per show (*e.g., "Only 14 seats left"*).

- **🧾 Order Summary & Instant Checkout**:
  - Customer contact details (*Name, Email, Phone Number*).
  - Transparent fee calculation: Ticket Subtotal + 18% GST + Convenience Fee.
  - Mock Payment Gateways (*UPI / QR, Credit/Debit Card, Net Banking*).

- **🎟️ Digital E-Ticket Pass**:
  - Perforated cinema ticket card design with side cutouts and barcode.
  - Scannable QR code with unique booking verification code (*e.g. `CHB-849201`*).
  - One-click **Print / Save as PDF** support.

- **📋 My Bookings Portal**:
  - Search tickets by Booking ID or Customer Email.
  - View full e-ticket receipts anytime.
  - **Cancellation & Seat Release**: Cancelling an order automatically releases the booked seats back to the hall in real-time!

- **🛡️ Cinema Admin Portal**:
  - Real-time business metrics (*Total Revenue, Tickets Sold, Active Shows, Catalog count*).
  - Add new movies with posters and details.
  - Schedule new showtimes across screens.
  - Complete booking audit log table.

- **⚡ Dual-Mode Database Support**:
  - Seamlessly connects to **MongoDB** (local or MongoDB Atlas) via Mongoose.
  - If a local MongoDB daemon is not detected, it automatically activates a persistent local JSON database engine so **the project runs immediately out-of-the-box without requiring any database setup!**

---

## 🏗️ Project Architecture

```
Cinema Hall Ticket Booking System/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & dual-mode fallback
│   ├── controllers/
│   │   ├── movieController.js    # Movie CRUD & search
│   │   ├── showController.js     # Show scheduling & seat layout
│   │   └── bookingController.js  # Seat reservation, pricing & cancellation
│   ├── models/
│   │   ├── Movie.js              # Mongoose Movie Schema
│   │   ├── Show.js               # Mongoose Showtime & Booked Seats Schema
│   │   └── Booking.js            # Mongoose Booking Schema
│   ├── routes/
│   │   ├── movieRoutes.js        # /api/movies
│   │   ├── showRoutes.js         # /api/shows
│   │   └── bookingRoutes.js      # /api/bookings
│   ├── data/
│   │   ├── seedData.js           # Sample movies & showtime generator
│   │   └── seed.js               # Standalone database seeder
│   ├── server.js                 # Express server & static asset handler
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment config (PORT, MONGO_URI)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar & search
│   │   │   ├── Footer.jsx        # Footer & cinema amenities
│   │   │   ├── MovieCard.jsx     # Movie poster card with hover zoom
│   │   │   ├── SeatMatrix.jsx    # Curved screen & interactive seat grid
│   │   │   └── TicketPass.jsx    # Digital printable ticket pass
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero showcase, tabs & movie grid
│   │   │   ├── MovieDetail.jsx   # Movie profile & showtime selector
│   │   │   ├── BookingPage.jsx   # Seat selection, summary & checkout
│   │   │   ├── MyBookings.jsx    # Ticket lookup & cancellation
│   │   │   └── AdminDashboard.jsx# Admin metrics & show scheduler
│   │   ├── services/
│   │   │   └── api.js            # Frontend REST API client
│   │   ├── App.jsx               # Main application container & routing
│   │   ├── index.css             # Cinematic dark styling & animations
│   │   └── main.jsx              # React DOM entrypoint
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite build & API proxy configuration
│
├── package.json                  # Root monorepo scripts
└── README.md                     # Comprehensive documentation
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (comes with Node.js)
- *(Optional)* **MongoDB** (Local or MongoDB Atlas connection string)

### 1. Installation
In the project root directory, run:
```bash
npm run install:all
```
*(Dependencies are already installed in this workspace)*

### 2. (Optional) Configure MongoDB
By default, the application runs out-of-the-box using the local persistent database. If you have MongoDB installed locally or an Atlas connection string, update `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cinema_booking
NODE_ENV=development
```

### 3. (Optional) Seed the Database
To populate sample blockbuster movies (*Dune: Part Two, Interstellar, Oppenheimer, The Dark Knight, Spider-Man Across the Spider-Verse*) and multi-day showtimes:
```bash
npm run seed
```
*(The backend also automatically seeds sample data on the first start if the database is empty).*

### 4. Running the Application

#### Option A: Run Both Client & Server Concurrently (Recommended for Development)
Open two terminal tabs:

**Terminal 1 (Backend API):**
```bash
npm run server
```
*Backend runs at: `http://localhost:5000`*

**Terminal 2 (Frontend with Vite Hot-Reload):**
```bash
npm run client
```
*Frontend opens at: `http://localhost:3000`*

---

#### Option B: Run Full-Stack Production Build (Single Port)
```bash
npm run build
npm start
```
*The full application (React UI + Express API) will be served at `http://localhost:5000`!*

---

## 📡 REST API Reference

### Movies
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies` | Get all movies (supports `?status=now_showing` and `?search=dune`) |
| `GET` | `/api/movies/:id` | Get movie details by ID with associated shows |
| `POST` | `/api/movies` | Create a new movie (Admin) |
| `PUT` | `/api/movies/:id` | Update movie details |
| `DELETE` | `/api/movies/:id` | Delete a movie |

### Showtimes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/shows` | Get shows (supports `?movieId=...` and `?date=YYYY-MM-DD`) |
| `GET` | `/api/shows/:id` | Get show details with seat occupancy and layout configuration |
| `POST` | `/api/shows` | Schedule a new show (Admin) |
| `DELETE` | `/api/shows/:id` | Delete a show |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Book seats, calculate pricing & lock seats |
| `GET` | `/api/bookings` | Retrieve bookings (supports `?email=...` and `?bookingId=...`) |
| `GET` | `/api/bookings/:id` | Get booking details or e-ticket by ID / Code |
| `PUT` | `/api/bookings/:id/cancel`| Cancel booking and release seats |
| `GET` | `/api/bookings/admin/stats`| Get overall multiplex analytics & revenue |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API status, database type, and movie/show counts |

---

## 🎟️ Seat Pricing Structure

| Tier | Rows | Price | Amenities |
|---|---|---|---|
| **VIP / Platinum** | Rows A, B | ₹350 | Ultra-plush motorized leather recliner, front view, priority lounge service |
| **Executive Gold** | Rows C, D, E | ₹250 | Premium ergonomic cushioning, optimal viewing angle |
| **Classic Silver** | Rows F, G, H | ₹180 | Standard cinema seating, full acoustic surround coverage |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide React Icons, Responsive Cinematic CSS & Google Fonts (*Outfit* and *Plus Jakarta Sans*).
- **Backend**: Node.js, Express.js, CORS, Dotenv, Crypto.
- **Database**: MongoDB & Mongoose ORM with embedded local persistence fallback.

