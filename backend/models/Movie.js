const mongoose = require("mongoose");
const { isMongo, readLocalDb, writeLocalDb } = require("../config/db");
const crypto = require("crypto");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{ type: String }],
  duration: { type: Number, required: true },
  rating: { type: Number, default: 8.0 },
  language: { type: String, default: "English" },
  releaseDate: { type: String },
  poster: { type: String, required: true },
  banner: { type: String },
  director: { type: String },
  cast: [{ type: String }],
  status: { type: String, enum: ["now_showing", "coming_soon"], default: "now_showing" },
  certificate: { type: String, default: "UA" },
  createdAt: { type: Date, default: Date.now }
});

const MongooseMovie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

// Hybrid model providing identical async interface
const Movie = {
  find: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseMovie.find(filter).sort({ createdAt: -1 });
    }
    const db = readLocalDb();
    let results = db.movies || [];
    if (filter.status) {
      results = results.filter(m => m.status === filter.status);
    }
    if (filter.title && filter.title.$regex) {
      const re = new RegExp(filter.title.$regex, filter.title.$options || "i");
      results = results.filter(m => re.test(m.title));
    }
    return results;
  },

  findById: async (id) => {
    if (isMongo()) {
      return await MongooseMovie.findById(id);
    }
    const db = readLocalDb();
    return (db.movies || []).find(m => String(m._id) === String(id) || String(m.id) === String(id)) || null;
  },

  create: async (data) => {
    if (isMongo()) {
      return await MongooseMovie.create(data);
    }
    const db = readLocalDb();
    const newMovie = {
      _id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.movies = db.movies || [];
    db.movies.push(newMovie);
    writeLocalDb(db);
    return newMovie;
  },

  insertMany: async (items) => {
    if (isMongo()) {
      return await MongooseMovie.insertMany(items);
    }
    const db = readLocalDb();
    db.movies = db.movies || [];
    const created = items.map(item => ({
      _id: item._id || crypto.randomUUID(),
      ...item,
      createdAt: new Date().toISOString()
    }));
    db.movies.push(...created);
    writeLocalDb(db);
    return created;
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    if (isMongo()) {
      return await MongooseMovie.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    const db = readLocalDb();
    const idx = (db.movies || []).findIndex(m => String(m._id) === String(id) || String(m.id) === String(id));
    if (idx === -1) return null;
    db.movies[idx] = { ...db.movies[idx], ...update, updatedAt: new Date().toISOString() };
    writeLocalDb(db);
    return db.movies[idx];
  },

  findByIdAndDelete: async (id) => {
    if (isMongo()) {
      return await MongooseMovie.findByIdAndDelete(id);
    }
    const db = readLocalDb();
    const idx = (db.movies || []).findIndex(m => String(m._id) === String(id) || String(m.id) === String(id));
    if (idx === -1) return null;
    const deleted = db.movies.splice(idx, 1)[0];
    writeLocalDb(db);
    return deleted;
  },

  countDocuments: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseMovie.countDocuments(filter);
    }
    const movies = await Movie.find(filter);
    return movies.length;
  },

  deleteMany: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseMovie.deleteMany(filter);
    }
    const db = readLocalDb();
    db.movies = [];
    writeLocalDb(db);
    return { deletedCount: 0 };
  },

  schema: movieSchema
};

module.exports = Movie;

