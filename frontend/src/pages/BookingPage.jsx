import React, { useState } from "react";
import { ArrowLeft, Ticket, CheckCircle2, AlertCircle } from "lucide-react";
import SeatMatrix from "../components/SeatMatrix";
import TicketPass from "../components/TicketPass";
import { createBooking } from "../services/api";

export default function BookingPage({ show, movie, onBack, onViewAllBookings }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!show) return null;

  const ticketPrice = 200;
  const totalAmount = selectedSeats.length * ticketPrice;

  const handleToggleSeat = (seatId) => {
    setErrorMsg("");
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (selectedSeats.length === 0) {
      setErrorMsg("Please select at least one seat from the grid.");
      return;
    }
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMsg("Please fill in your name, email, and phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        showId: show._id || show.id,
        seats: selectedSeats,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim()
      };

      const result = await createBooking(payload);
      setConfirmedBooking(result);
    } catch (err) {
      setErrorMsg(err.message || "Failed to book tickets. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // If booked, display the simple confirmation receipt
  if (confirmedBooking) {
    return (
      <TicketPass
        booking={confirmedBooking}
        onBackToHome={onBack}
        onViewAllBookings={onViewAllBookings}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shows
        </button>

        <div className="text-right">
          <h2 className="font-heading font-bold text-base text-white">
            {show.movieTitle || (movie && movie.title)}
          </h2>
          <p className="text-xs text-slate-400">
            {show.screenName} • {show.showDate} ({show.showTime})
          </p>
        </div>
      </div>

      {/* Main Grid: Simple Seat Picker on Left, Simple Checkout Form on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Simple Seat Picker */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <SeatMatrix
            show={show}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
          />
        </div>

        {/* Right 1 Col: Simple Checkout Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="font-heading font-bold text-base text-white pb-3 border-b border-slate-800 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-400" />
            Booking Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Price per seat:</span>
              <span className="text-white font-semibold">₹{ticketPrice}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Selected Seats:</span>
              <span className="font-bold text-amber-400">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Quantity:</span>
              <span className="text-white">{selectedSeats.length}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
              <span>Total:</span>
              <span className="text-emerald-400 text-base">₹{totalAmount}</span>
            </div>
          </div>

          {/* Customer Details Form */}
          <form onSubmit={handleCheckout} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || selectedSeats.length === 0}
              className={`w-full py-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                selectedSeats.length === 0
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : submitting
                  ? "bg-amber-600 text-slate-950 cursor-wait"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
              }`}
            >
              {submitting ? "Booking..." : `Confirm & Book (${selectedSeats.length} seats)`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
