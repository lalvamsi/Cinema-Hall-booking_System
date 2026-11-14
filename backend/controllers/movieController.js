const Movie = require("../models/Movie");
const Show = require("../models/Show");

// @desc    Get all movies (with optional search & status filter)
// @route   GET /api/movies
exports.getMovies = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    const movies = await Movie.find(filter);
    res.json({ success: true, count: movies.length, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single movie by ID (with shows)
// @route   GET /api/movies/:id
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    const shows = await Show.find({ movie: movie._id || movie.id });
    res.json({ success: true, data: { ...movie, shows } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new movie (Admin)
// @route   POST /api/movies
exports.createMovie = async (req, res) => {
  try {
    const { title, description, genre, duration, rating, language, releaseDate, poster, banner, director, cast, status, certificate } = req.body;
    if (!title || !description || !duration || !poster) {
      return res.status(400).json({ success: false, message: "Title, description, duration and poster are required." });
    }
    const movie = await Movie.create({
      title,
      description,
      genre: Array.isArray(genre) ? genre : (genre ? genre.split(",").map(g => g.trim()) : ["Drama"]),
      duration: Number(duration),
      rating: Number(rating) || 8.0,
      language: language || "English",
      releaseDate: releaseDate || new Date().toISOString().split("T")[0],
      poster,
      banner: banner || poster,
      director: director || "Director",
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(",").map(c => c.trim()) : []),
      status: status || "now_showing",
      certificate: certificate || "UA"
    });
    res.status(201).json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a movie (Admin)
// @route   PUT /api/movies/:id
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, data: movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a movie (Admin)
// @route   DELETE /api/movies/:id
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.json({ success: true, message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
