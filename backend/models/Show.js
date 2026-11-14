const mongoose = require("mongoose");
const { isMongo, readLocalDb, writeLocalDb } = require("../config/db");
const crypto = require("crypto");

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  movieTitle: { type: String },
  screenName: { type: String, required: true },
  screenType: { type: String, default: "Standard" },
  showDate: { type: String, required: true }, // YYYY-MM-DD
  showTime: { type: String, required: true }, // e.g. "10:00 AM"
  ticketPrices: {
    platinum: { type: Number, default: 350 },
    gold: { type: Number, default: 250 },
    silver: { type: Number, default: 180 }
  },
  bookedSeats: [{ type: String }],
  totalSeats: { type: Number, default: 92 },
  createdAt: { type: Date, default: Date.now }
});

const MongooseShow = mongoose.models.Show || mongoose.model("Show", showSchema);

const Show = {
  find: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseShow.find(filter).populate("movie");
    }
    const db = readLocalDb();
    let results = db.shows || [];
    if (filter.movie) {
      results = results.filter(s => String(s.movie) === String(filter.movie));
    }
    if (filter.showDate) {
      results = results.filter(s => s.showDate === filter.showDate);
    }
    return results;
  },

  findById: async (id) => {
    if (isMongo()) {
      return await MongooseShow.findById(id).populate("movie");
    }
    const db = readLocalDb();
    return (db.shows || []).find(s => String(s._id) === String(id) || String(s.id) === String(id)) || null;
  },

  create: async (data) => {
    if (isMongo()) {
      return await MongooseShow.create(data);
    }
    const db = readLocalDb();
    const newShow = {
      _id: crypto.randomUUID(),
      bookedSeats: [],
      ...data,
      createdAt: new Date().toISOString()
    };
    db.shows = db.shows || [];
    db.shows.push(newShow);
    writeLocalDb(db);
    return newShow;
  },

  insertMany: async (items) => {
    if (isMongo()) {
      return await MongooseShow.insertMany(items);
    }
    const db = readLocalDb();
    db.shows = db.shows || [];
    const created = items.map(item => ({
      _id: item._id || crypto.randomUUID(),
      bookedSeats: item.bookedSeats || [],
      ...item,
      createdAt: new Date().toISOString()
    }));
    db.shows.push(...created);
    writeLocalDb(db);
    return created;
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    if (isMongo()) {
      return await MongooseShow.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    const db = readLocalDb();
    const idx = (db.shows || []).findIndex(s => String(s._id) === String(id) || String(s.id) === String(id));
    if (idx === -1) return null;
    db.shows[idx] = { ...db.shows[idx], ...update, updatedAt: new Date().toISOString() };
    writeLocalDb(db);
    return db.shows[idx];
  },

  findByIdAndDelete: async (id) => {
    if (isMongo()) {
      return await MongooseShow.findByIdAndDelete(id);
    }
    const db = readLocalDb();
    const idx = (db.shows || []).findIndex(s => String(s._id) === String(id) || String(s.id) === String(id));
    if (idx === -1) return null;
    const deleted = db.shows.splice(idx, 1)[0];
    writeLocalDb(db);
    return deleted;
  },

  countDocuments: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseShow.countDocuments(filter);
    }
    const shows = await Show.find(filter);
    return shows.length;
  },

  deleteMany: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseShow.deleteMany(filter);
    }
    const db = readLocalDb();
    db.shows = [];
    writeLocalDb(db);
    return { deletedCount: 0 };
  },

  schema: showSchema
};

module.exports = Show;
