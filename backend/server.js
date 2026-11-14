require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { connectDB, isMongo } = require("./config/db");

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for easy debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const moviesCount = await Movie.countDocuments({});
  const showsCount = await Show.countDocuments({});
  res.json({
    status: "healthy",
    database: isMongo() ? "MongoDB" : "Local Persistent JSON DB",
    moviesCount,
    showsCount,
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend assets if built
const distPath = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // API Root info when frontend is running separately on Vite
  app.get("/", (req, res) => {
    res.json({
      message: "🎬 Cinema Hall Ticket Booking System API is running",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        movies: "/api/movies",
        shows: "/api/shows",
        bookings: "/api/bookings",
        adminStats: "/api/bookings/admin/stats"
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Server & Seed if empty
async function startServer() {
  await connectDB();

  try {
    const movieCount = await Movie.countDocuments({});
    if (movieCount === 0) {
      console.log("[Auto-Init] No movies found in database. Seeding initial data...");
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

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🍿 Cinema Booking Backend running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🚀 API Docs: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

startServer();
