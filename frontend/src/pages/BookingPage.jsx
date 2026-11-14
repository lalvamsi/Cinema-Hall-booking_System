import React, { useState } from "react";
import { ArrowLeft, Ticket, ShieldCheck, CreditCard, Smartphone, Building2, Check, AlertCircle } from "lucide-react";
import SeatMatrix from "../components/SeatMatrix";
import TicketPass from "../components/TicketPass";
import { createBooking } from "../services/api";

export default function BookingPage({ show, movie, onBack, onViewAllBookings }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!show) return null;

  const prices = show.ticketPrices || { platinum: 350, gold: 250, silver: 180 };

  // Calculate pricing breakdown
  const getSeatInfo = (seat) => {
    const row = seat.charAt(0).toUpperCase();
    if (row === "A" || row === "B") return { tier: "VIP / Platinum", price: prices.platinum };
    if (row === "C" || row === "D" || row === "E") return { tier: "Gold / Executive", price: prices.gold };
    return { tier: "Silver / Classic", price: prices.silver };
  };

  const subtotal = selectedSeats.reduce((sum, seat) => sum + getSeatInfo(seat).price, 0);
  const tax = selectedSeats.length > 0 ? Math.round(subtotal * 0.18) : 0;
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const totalAmount = subtotal + tax + convenienceFee;

  const handleToggleSeat = (seatId) => {
    setErrorMsg("");
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (selectedSeats.length === 0) {
      setErrorMsg("Please select at least one seat to proceed.");
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
      setErrorMsg(err.message || "Failed to complete booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // If already confirmed, display the e-ticket
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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white border border-slate-800 transition"
            title="Back to showtimes"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-heading font-black text-lg sm:text-xl text-white">
              {show.movieTitle || (movie && movie.title)}
            </h1>
            <p className="text-xs text-slate-400">
              {show.screenName} • {show.showDate} at <span className="text-amber-400 font-bold">{show.showTime}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400">Step 2 of 3:</span>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            Seat Selection
          </span>
        </div>
      </div>

      {/* Main Grid: Left Seat Matrix, Right Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Interactive Cinema Hall Grid */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-8">
          <SeatMatrix
            show={show}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            maxSeats={8}
          />
        </div>

        {/* Right Column: Checkout & Summary Panel */}
        <div className="glass-panel p-6 space-y-6 lg:sticky lg:top-24 border border-slate-800">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Ticket className="w-4 h-4 text-amber-400" />
            Booking Summary
          </h3>

          {/* Selected Seats Chips */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Selected Seats ({selectedSeats.length})
            </span>
            {selectedSeats.length === 0 ? (
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                Please click seats in the cinema layout to select them.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedSeats.map(seat => {
                  const info = getSeatInfo(seat);
                  return (
                    <div
                      key={seat}
                      className="flex items-center justify-between text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">{seat}</span>
                        <span className="text-[11px] text-slate-400">({info.tier})</span>
                      </div>
                      <span className="font-semibold text-slate-200">₹{info.price}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer Details Form */}
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                    paymentMethod === "upi"
                      ? "bg-amber-500/15 border-amber-400 text-amber-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Smartphone className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                    paymentMethod === "card"
                      ? "bg-amber-500/15 border-amber-400 text-amber-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                    paymentMethod === "netbanking"
                      ? "bg-amber-500/15 border-amber-400 text-amber-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Building2 className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">NetBanking</span>
                </button>
              </div>
            </div>

            {/* Price Breakdown Calculation */}
            <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tickets Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Convenience Fee</span>
                <span>₹{convenienceFee}</span>
              </div>
              <div className="border-t border-slate-800/80 pt-2 flex justify-between font-heading font-black text-sm text-white">
                <span>Total Amount</span>
                <span className="text-amber-400 text-base">₹{totalAmount}</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Confirm & Pay Button */}
            <button
              type="submit"
              disabled={submitting || selectedSeats.length === 0}
              className={`w-full py-3 rounded-xl font-heading font-black text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                selectedSeats.length === 0
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : submitting
                  ? "bg-amber-600 text-slate-950 cursor-wait"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 hover:scale-[1.02]"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing Reservation...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay ₹{totalAmount} & Confirm</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Instant Confirmation • 100% Guaranteed Booking
          </p>
        </div>
      </div>
    </div>
  );
}

