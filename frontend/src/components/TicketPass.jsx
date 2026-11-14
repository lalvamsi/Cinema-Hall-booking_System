import React from "react";
import { CheckCircle2, Film, Calendar, Clock, MapPin, User, Ticket } from "lucide-react";

export default function TicketPass({ booking, onBackToHome, onViewAllBookings }) {
  if (!booking) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
        {/* Success Icon */}
        <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl text-white">Booking Confirmed!</h2>
          <p className="text-xs text-slate-400 mt-1">Thank you for your booking.</p>
        </div>

        {/* Booking Details Box */}
        <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 text-left space-y-3.5 text-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
            <span className="text-slate-400">Booking ID:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{booking.bookingId}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-slate-400">Movie:</span>
            <span className="font-bold text-white text-right">{booking.movieTitle}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Cinema Hall:</span>
            <span className="text-slate-200">{booking.screenName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Date & Time:</span>
            <span className="text-slate-200">{booking.showDate} • {booking.showTime}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Seats:</span>
            <div className="flex flex-wrap gap-1">
              {(booking.seats || []).map((s) => (
                <span key={s} className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Customer:</span>
            <span className="text-slate-200">{booking.customerName} ({booking.customerPhone})</span>
          </div>

          <div className="pt-2.5 border-t border-slate-800 flex justify-between items-center font-bold text-sm">
            <span className="text-white">Total Amount Paid:</span>
            <span className="text-emerald-400 text-base">₹{booking.totalAmount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={onViewAllBookings}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
          >
            View My Bookings
          </button>
          <button
            onClick={onBackToHome}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition border border-slate-700"
          >
            Book Another Movie
          </button>
        </div>
      </div>
    </div>
  );
}
