import React, { useState, useEffect } from "react";
import { Ticket, Search, Calendar, Clock, MapPin, XCircle, CheckCircle, ArrowRight, Eye, AlertCircle } from "lucide-react";
import { fetchBookings, cancelBooking } from "../services/api";
import TicketPass from "../components/TicketPass";

export default function MyBookings({ onBookMovie }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchBookings(searchEmail, searchCode);
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllBookings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadAllBookings();
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this ticket? The booked seats will be released.")) {
      return;
    }
    try {
      await cancelBooking(id);
      setActionMessage("Booking cancelled successfully! Seats have been released.");
      setTimeout(() => setActionMessage(""), 5000);
      loadAllBookings();
    } catch (err) {
      alert(err.message || "Failed to cancel ticket");
    }
  };

  // If user selected a ticket to view
  if (selectedTicket) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedTicket(null)}
          className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
        >
          ← Back to All Tickets
        </button>
        <TicketPass
          booking={selectedTicket}
          onBackToHome={() => setSelectedTicket(null)}
          onViewAllBookings={() => setSelectedTicket(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-heading font-black text-2xl text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-amber-400" />
            My Tickets & Reservations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your active cinema bookings, download digital e-tickets, or manage cancellations.
          </p>
        </div>

        <button
          onClick={onBookMovie}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          Book New Ticket <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search Filter Bar */}
      <form onSubmit={handleSearch} className="glass-panel p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Booking ID (e.g. CHB-123456)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="relative flex-1">
          <input
            type="email"
            placeholder="Filter by Email address"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          type="submit"
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-5 py-2 rounded-xl transition border border-slate-700"
        >
          Search
        </button>
      </form>

      {/* Bookings List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading your tickets...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">No Tickets Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't booked any movie tickets yet, or no booking matched your search criteria.
          </p>
          <button
            onClick={onBookMovie}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-amber-500/20"
          >
            Explore Now Showing Movies
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const isCancelled = booking.status === "Cancelled";

            return (
              <div
                key={booking._id || booking.id || booking.bookingId}
                className={`glass-card p-5 border transition flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  isCancelled ? "border-rose-900/40 opacity-70" : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Left: Poster & Details */}
                <div className="flex gap-4 items-center">
                  {booking.moviePoster && (
                    <img
                      src={booking.moviePoster}
                      alt={booking.movieTitle}
                      className="w-16 h-22 object-cover rounded-xl shadow-md border border-slate-700 flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {booking.bookingId}
                      </span>
                      {isCancelled ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
                          Cancelled (Refunded)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Confirmed
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-black text-base text-white">
                      {booking.movieTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {booking.screenName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        {booking.showDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {booking.showTime}
                      </span>
                    </div>

                    {/* Seats Tally */}
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-400">Seats:</span>
                      <div className="flex flex-wrap gap-1">
                        {(booking.seats || []).map(seat => (
                          <span key={seat} className="bg-slate-800 text-slate-200 font-bold px-2 py-0.5 rounded text-[11px] border border-slate-700">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Total Amount & Action Buttons */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 block">Total Amount</span>
                    <span className="font-heading font-black text-lg text-white">
                      ₹{booking.totalAmount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicket(booking)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View E-Ticket
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancel(booking._id || booking.id || booking.bookingId)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-medium border border-rose-500/20 transition"
                        title="Cancel this ticket & release seats"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

