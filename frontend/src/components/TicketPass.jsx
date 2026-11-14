import React from "react";
import { Printer, Download, CheckCircle2, QrCode, Calendar, Clock, Film, MapPin, User, Phone } from "lucide-react";

export default function TicketPass({ booking, onBackToHome, onViewAllBookings }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Confirmation Banner */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 mb-3 shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-white">
          Booking Confirmed!
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Your e-ticket has been generated. Show this at the cinema entrance.
        </p>
      </div>

      {/* Ticket Pass Component */}
      <div className="ticket-wrapper print-ticket-area w-full bg-[#121927] border-2 border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Notches for authentic perforated ticket look */}
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />

        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 px-6 py-4 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 font-bold" />
            <span className="font-heading font-black text-lg tracking-tight">CinePass Multiplex</span>
          </div>
          <span className="bg-slate-950 text-amber-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-amber-400/40">
            {booking.bookingId}
          </span>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Movie Details */}
          <div className="flex gap-4 items-start">
            {booking.moviePoster && (
              <img
                src={booking.moviePoster}
                alt={booking.movieTitle}
                className="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-700/80 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Official E-Pass
              </span>
              <h3 className="font-heading font-black text-xl text-white mt-1 leading-snug">
                {booking.movieTitle}
              </h3>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {booking.screenName}
              </p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {booking.showDate}
                </span>
                <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {booking.showTime}
                </span>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="border-t-2 border-dashed border-slate-700 my-4" />

          {/* Seats & Tier Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Booked Seats</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(booking.seats || []).map(seat => (
                  <span key={seat} className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded shadow-sm">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Class / Category</span>
              <p className="text-xs font-bold text-white mt-1">
                {booking.seatTier || "VIP / Executive"}
              </p>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Guest Name:</span>
              <p className="font-semibold text-white mt-0.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {booking.customerName}
              </p>
              <p className="text-[11px] text-slate-400">{booking.customerEmail}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Total Paid:</span>
              <p className="font-heading font-black text-xl text-emerald-400 mt-0.5">
                ₹{booking.totalAmount}
              </p>
              <span className="text-[10px] text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                ● Paid via Secure Gateway
              </span>
            </div>
          </div>

          {/* QR Code and Barcode Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* SVG Mock QR Code */}
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="#000000">
                  <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h10v20H40zM50 20h20v10H50zM0 40h20v10H0zM20 50h10v20H20zM40 40h20v20H40zM70 40h30v10H70zM80 60h20v10H80zM40 70h10v30H40zM60 80h20v10H60zM70 90h30v10H70z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Fast Gate Entry</p>
                <p className="text-[10px] text-slate-400">Scan at Turnstile or Audi Entrance</p>
                <p className="text-[10px] font-mono text-amber-400 mt-0.5">CODE: {booking.bookingId}</p>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex gap-[2px] h-9 items-end">
                {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2].map((w, idx) => (
                  <div key={idx} className="bg-slate-300" style={{ width: `${w * 1.5}px`, height: "100%" }} />
                ))}
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">AUTH-VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Excluded from print) */}
      <div className="no-print mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          Print / Save PDF
        </button>

        <button
          onClick={onViewAllBookings}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20"
        >
          View in My Bookings
        </button>

        <button
          onClick={onBackToHome}
          className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition"
        >
          Book Another Movie
        </button>
      </div>
    </div>
  );
}

