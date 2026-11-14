const Show = require("../models/Show");
const Movie = require("../models/Movie");

// @desc    Get shows by Movie ID (optional date filter)
// @route   GET /api/shows
exports.getShows = async (req, res) => {
  try {
    const { movieId, date } = req.query;
    let filter = {};
    if (movieId) filter.movie = movieId;
    if (date) filter.showDate = date;

    const shows = await Show.find(filter);
    res.json({ success: true, count: shows.length, data: shows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single show by ID (including seat layout data)
// @route   GET /api/shows/:id
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    
    // Seat tier configuration for Cinema Hall
    const layoutConfig = {
      screenName: show.screenName,
      screenType: show.screenType,
      rows: [
        { row: "A", tier: "VIP / Platinum", price: show.ticketPrices.platinum, seats: 10 },
        { row: "B", tier: "VIP / Platinum", price: show.ticketPrices.platinum, seats: 10 },
        { row: "C", tier: "Gold / Executive", price: show.ticketPrices.gold, seats: 12 },
        { row: "D", tier: "Gold / Executive", price: show.ticketPrices.gold, seats: 12 },
        { row: "E", tier: "Gold / Executive", price: show.ticketPrices.gold, seats: 12 },
        { row: "F", tier: "Silver / Classic", price: show.ticketPrices.silver, seats: 12 },
        { row: "G", tier: "Silver / Classic", price: show.ticketPrices.silver, seats: 12 },
        { row: "H", tier: "Silver / Classic", price: show.ticketPrices.silver, seats: 12 }
      ]
    };

    res.json({
      success: true,
      data: {
        ...show,
        layoutConfig,
        availableSeatsCount: show.totalSeats - (show.bookedSeats ? show.bookedSeats.length : 0)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new show (Admin)
// @route   POST /api/shows
exports.createShow = async (req, res) => {
  try {
    const { movieId, screenName, screenType, showDate, showTime, ticketPrices } = req.body;
    if (!movieId || !screenName || !showDate || !showTime) {
      return res.status(400).json({ success: false, message: "Movie, screen, showDate, and showTime are required." });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    const show = await Show.create({
      movie: movie._id || movie.id,
      movieTitle: movie.title,
      screenName,
      screenType: screenType || "Dolby Atmos 4K",
      showDate,
      showTime,
      ticketPrices: ticketPrices || { platinum: 350, gold: 250, silver: 180 },
      bookedSeats: [],
      totalSeats: 92
    });

    res.status(201).json({ success: true, data: show });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a show (Admin)
// @route   DELETE /api/shows/:id
exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    res.json({ success: true, message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

