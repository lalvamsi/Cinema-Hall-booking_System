require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");

// Routes
const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Auto-seed helper
const Movie = require("./models/Movie");
const Show = require("./models/Show");
const { sampleMovies, generateSampleShows } = require("./data/seedData");

const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const clientBuildPath = path.join(__dirname, "..", "frontend", "dist");
if (process.env.SERVE_CLIENT === "true") {
  app.use(express.static(clientBuildPath));
}

// Initialize DB + auto-seed on first use
let dbInitialized = false;
async function initDB() {
  if (dbInitialized) return;
  dbInitialized = true;
  await connectDB();
  try {
    const movieCount = await Movie.countDocuments({});
    if (movieCount === 0) {
      console.log("[Auto-Init] No movies found. Seeding initial data...");
      const inserted = await Movie.insertMany(sampleMovies);
      const showsData = generateSampleShows(inserted);
      await Show.insertMany(showsData);
      console.log(`[Auto-Init] Populated ${inserted.length} movies and ${showsData.length} showtimes!`);
    } else {
      console.log(`[Database] Found ${movieCount} movies ready.`);
    }
  } catch (seedErr) {
    console.error("[Auto-Init Error]", seedErr);
  }
}

// Run DB init middleware for every request on serverless
app.use(async (req, res, next) => {
  await initDB();
  next();
});

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/api/health", async (req, res) => {
  const moviesCount = await Movie.countDocuments({});
  const showsCount = await Show.countDocuments({});
  res.json({
    status: "healthy",
    database: "MongoDB Atlas",
    moviesCount,
    showsCount,
    timestamp: new Date().toISOString()
  });
});

if (process.env.SERVE_CLIENT === "true") {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Root info endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🎬 Cinema Hall Ticket Booking System API is running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      movies: "/api/movies",
      shows: "/api/shows",
      bookings: "/api/bookings"
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
