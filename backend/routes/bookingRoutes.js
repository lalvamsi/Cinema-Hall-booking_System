const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  getAdminStats
} = require("../controllers/bookingController");

router.get("/admin/stats", getAdminStats);

router.route("/")
  .get(getBookings)
  .post(createBooking);

router.route("/:id")
  .get(getBookingById);

router.put("/:id/cancel", cancelBooking);

module.exports = router;

