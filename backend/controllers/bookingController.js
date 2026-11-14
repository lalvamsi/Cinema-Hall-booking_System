const Booking = require("../models/Booking");
const Show = require("../models/Show");
const Movie = require("../models/Movie");

// Helper to determine price based on row letter
function getSeatPrice(seatNumber, ticketPrices) {
  const row = seatNumber.charAt(0).toUpperCase();
  if (row === "A" || row === "B") {
    return { tier: "VIP / Platinum", price: ticketPrices.platinum || 350 };
  } else if (row === "C" || row === "D" || row === "E") {
    return { tier: "Gold / Executive", price: ticketPrices.gold || 250 };
  } else {
    return { tier: "Silver / Classic", price: ticketPrices.silver || 180 };
  }
}

// @desc    Create a new booking (Book Seats)
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { showId, seats, customerName, customerEmail, customerPhone } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: "Show ID and at least one seat are required." });
    }
    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({ success: false, message: "Customer name, email, and phone are required." });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    // Check if any seat is already booked
    const currentBooked = show.bookedSeats || [];
    const conflictingSeats = seats.filter(s => currentBooked.includes(s));
    if (conflictingSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats already booked: ${conflictingSeats.join(", ")}. Please select different seats.`
      });
    }

    // Calculate prices
    let subtotal = 0;
    let tiers = new Set();
    seats.forEach(seat => {
      const { tier, price } = getSeatPrice(seat, show.ticketPrices);
      subtotal += price;
      tiers.add(tier);
    });

    const taxAndFees = Math.round(subtotal * 0.18) + 30; // 18% GST + convenience fee
    const totalAmount = subtotal + taxAndFees;

    // Generate formatted Booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `CHB-${Date.now().toString().slice(-4)}${randomSuffix}`;

    // Get Movie details for poster
    let moviePoster = "";
    if (show.movie) {
      const movie = await Movie.findById(show.movie._id || show.movie);
      if (movie) moviePoster = movie.poster;
    }

    // 1. Create booking
    const booking = await Booking.create({
      bookingId,
      show: show._id || show.id,
      movieTitle: show.movieTitle,
      moviePoster,
      screenName: show.screenName,
      showDate: show.showDate,
      showTime: show.showTime,
      seats,
      seatTier: Array.from(tiers).join(", "),
      customerName,
      customerEmail,
      customerPhone,
      subtotal,
      taxAndFees,
      totalAmount,
      paymentStatus: "Paid",
      status: "Confirmed"
    });

    // 2. Add seats to show bookedSeats
    const updatedBookedSeats = [...currentBooked, ...seats];
    await Show.findByIdAndUpdate(show._id || show.id, { bookedSeats: updatedBookedSeats });

    res.status(201).json({
      success: true,
      message: "Ticket booked successfully!",
      data: booking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all bookings (with search / email filter)
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
  try {
    const { email, bookingId } = req.query;
    let filter = {};
    if (email) filter.customerEmail = email;
    if (bookingId) filter.bookingId = bookingId;

    const bookings = await Booking.find(filter);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get booking by ID or Booking Code
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = await Booking.findById(id);
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id.toUpperCase() });
    }
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Cancel a booking (releases seats)
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = await Booking.findById(id);
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id.toUpperCase() });
    }
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    // Release seats in the show
    if (booking.show) {
      const show = await Show.findById(booking.show);
      if (show && show.bookedSeats) {
        const remainingSeats = show.bookedSeats.filter(s => !booking.seats.includes(s));
        await Show.findByIdAndUpdate(show._id || show.id, { bookedSeats: remainingSeats });
      }
    }

    // Update booking status
    const updated = await Booking.findByIdAndUpdate(booking._id || booking.id, {
      status: "Cancelled",
      paymentStatus: "Refunded"
    });

    res.json({ success: true, message: "Booking cancelled successfully. Seats have been released.", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get dashboard statistics for Admin
// @route   GET /api/bookings/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    const moviesCount = await Movie.countDocuments({});
    const showsCount = await Show.countDocuments({});

    const totalConfirmed = bookings.filter(b => b.status === "Confirmed");
    const totalRevenue = totalConfirmed.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalSeatsBooked = totalConfirmed.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

    res.json({
      success: true,
      data: {
        totalBookings: bookings.length,
        totalConfirmedBookings: totalConfirmed.length,
        totalRevenue,
        totalSeatsBooked,
        totalMovies: moviesCount,
        totalShows: showsCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

