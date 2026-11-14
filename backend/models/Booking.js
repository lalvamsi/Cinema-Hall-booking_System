const mongoose = require("mongoose");
const { isMongo, readLocalDb, writeLocalDb } = require("../config/db");
const crypto = require("crypto");

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String },
  screenName: { type: String, required: true },
  showDate: { type: String, required: true },
  showTime: { type: String, required: true },
  seats: [{ type: String, required: true }],
  seatTier: { type: String },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  subtotal: { type: Number, required: true },
  taxAndFees: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Paid", "Pending", "Refunded"], default: "Paid" },
  status: { type: String, enum: ["Confirmed", "Cancelled"], default: "Confirmed" },
  bookingDate: { type: Date, default: Date.now }
});

const MongooseBooking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

const Booking = {
  find: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseBooking.find(filter).sort({ bookingDate: -1 });
    }
    const db = readLocalDb();
    let results = db.bookings || [];
    if (filter.customerEmail) {
      results = results.filter(b => b.customerEmail.toLowerCase() === filter.customerEmail.toLowerCase());
    }
    if (filter.bookingId) {
      results = results.filter(b => b.bookingId.toLowerCase() === filter.bookingId.toLowerCase());
    }
    return results.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
  },

  findById: async (id) => {
    if (isMongo()) {
      return await MongooseBooking.findById(id);
    }
    const db = readLocalDb();
    return (db.bookings || []).find(b => String(b._id) === String(id) || String(b.id) === String(id)) || null;
  },

  findOne: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseBooking.findOne(filter);
    }
    const list = await Booking.find(filter);
    return list.length > 0 ? list[0] : null;
  },

  create: async (data) => {
    if (isMongo()) {
      return await MongooseBooking.create(data);
    }
    const db = readLocalDb();
    const newBooking = {
      _id: crypto.randomUUID(),
      ...data,
      bookingDate: new Date().toISOString()
    };
    db.bookings = db.bookings || [];
    db.bookings.push(newBooking);
    writeLocalDb(db);
    return newBooking;
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    if (isMongo()) {
      return await MongooseBooking.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    const db = readLocalDb();
    const idx = (db.bookings || []).findIndex(b => String(b._id) === String(id) || String(b.id) === String(id));
    if (idx === -1) return null;
    db.bookings[idx] = { ...db.bookings[idx], ...update, updatedAt: new Date().toISOString() };
    writeLocalDb(db);
    return db.bookings[idx];
  },

  countDocuments: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseBooking.countDocuments(filter);
    }
    const bookings = await Booking.find(filter);
    return bookings.length;
  },

  deleteMany: async (filter = {}) => {
    if (isMongo()) {
      return await MongooseBooking.deleteMany(filter);
    }
    const db = readLocalDb();
    db.bookings = [];
    writeLocalDb(db);
    return { deletedCount: 0 };
  },

  schema: bookingSchema
};

module.exports = Booking;

