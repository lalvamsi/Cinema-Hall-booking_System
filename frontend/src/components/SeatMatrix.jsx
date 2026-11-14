import React from "react";
import { Crown, Star, Ticket, AlertCircle } from "lucide-react";

export default function SeatMatrix({
  show,
  selectedSeats,
  onToggleSeat,
  maxSeats = 8
}) {
  const bookedSeats = show.bookedSeats || [];
  const prices = show.ticketPrices || { platinum: 350, gold: 250, silver: 180 };

  // Definition of Rows
  const rowConfigs = [
    { row: "A", tier: "VIP / Platinum", price: prices.platinum, count: 10, icon: Crown, color: "text-amber-400" },
    { row: "B", tier: "VIP / Platinum", price: prices.platinum, count: 10, icon: Crown, color: "text-amber-400" },
    { row: "C", tier: "Gold / Executive", price: prices.gold, count: 12, icon: Star, color: "text-yellow-300" },
    { row: "D", tier: "Gold / Executive", price: prices.gold, count: 12, icon: Star, color: "text-yellow-300" },
    { row: "E", tier: "Gold / Executive", price: prices.gold, count: 12, icon: Star, color: "text-yellow-300" },
    { row: "F", tier: "Silver / Classic", price: prices.silver, count: 12, icon: Ticket, color: "text-slate-300" },
    { row: "G", tier: "Silver / Classic", price: prices.silver, count: 12, icon: Ticket, color: "text-slate-300" },
    { row: "H", tier: "Silver / Classic", price: prices.silver, count: 12, icon: Ticket, color: "text-slate-300" }
  ];

  // Group rows by tier for section headers
  const tiers = [
    { name: "VIP / Platinum Recliners", price: prices.platinum, rows: ["A", "B"], badge: "👑 VIP Lounge" },
    { name: "Gold / Executive", price: prices.gold, rows: ["C", "D", "E"], badge: "⭐ Executive" },
    { name: "Silver / Classic", price: prices.silver, rows: ["F", "G", "H"], badge: "🎟️ Classic" }
  ];

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= maxSeats) {
      alert(`You can select a maximum of ${maxSeats} seats per booking.`);
      return;
    }
    onToggleSeat(seatId);
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Curved Cinema Screen */}
      <div className="w-full max-w-2xl px-4 mb-6">
        <div className="screen-curve">
          <span className="screen-text">All Eyes This Way • Cinema Screen</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 text-xs text-slate-300 bg-slate-900/60 px-5 py-2.5 rounded-full border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#1e293b] border border-slate-600" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500 border border-emerald-400 shadow-sm shadow-emerald-500/50" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 opacity-60 flex items-center justify-center text-[10px] text-slate-500">✕</div>
          <span>Occupied</span>
        </div>
      </div>

      {/* Seat Matrix Layout */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div className="min-w-[580px] sm:min-w-[640px] px-4 space-y-6">
          {tiers.map((tierGroup, tIdx) => (
            <div key={tIdx} className="space-y-2">
              {/* Tier Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 px-2 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  {tierGroup.badge} - {tierGroup.name}
                </span>
                <span className="font-bold text-amber-400">
                  ₹{tierGroup.price} <span className="text-[10px] text-slate-500 font-normal">/ seat</span>
                </span>
              </div>

              {/* Rows inside this tier */}
              {tierGroup.rows.map(rowLetter => {
                const config = rowConfigs.find(r => r.row === rowLetter);
                const seatCount = config ? config.count : 12;
                const isTenSeats = seatCount === 10;

                return (
                  <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3">
                    {/* Row Letter Left */}
                    <span className="w-5 text-center font-bold text-xs text-slate-400">
                      {rowLetter}
                    </span>

                    {/* Left Block of Seats (1-3) */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {Array.from({ length: 3 }, (_, i) => {
                        const seatNumber = `${rowLetter}${i + 1}`;
                        const isBooked = bookedSeats.includes(seatNumber);
                        const isSelected = selectedSeats.includes(seatNumber);

                        return (
                          <button
                            key={seatNumber}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seatNumber)}
                            className={`seat ${isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                            title={`Seat ${seatNumber} - ₹${config.price}`}
                          >
                            {isBooked ? "✕" : i + 1}
                          </button>
                        );
                      })}
                    </div>

                    {/* Aisle Spacer */}
                    <div className="w-4 sm:w-6" />

                    {/* Middle Block of Seats (4 to 7 or 8) */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {Array.from({ length: isTenSeats ? 4 : 6 }, (_, i) => {
                        const seatIndex = 4 + i;
                        const seatNumber = `${rowLetter}${seatIndex}`;
                        const isBooked = bookedSeats.includes(seatNumber);
                        const isSelected = selectedSeats.includes(seatNumber);

                        return (
                          <button
                            key={seatNumber}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seatNumber)}
                            className={`seat ${isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                            title={`Seat ${seatNumber} - ₹${config.price}`}
                          >
                            {isBooked ? "✕" : seatIndex}
                          </button>
                        );
                      })}
                    </div>

                    {/* Aisle Spacer */}
                    <div className="w-4 sm:w-6" />

                    {/* Right Block of Seats */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {Array.from({ length: 3 }, (_, i) => {
                        const seatIndex = (isTenSeats ? 8 : 10) + i;
                        const seatNumber = `${rowLetter}${seatIndex}`;
                        const isBooked = bookedSeats.includes(seatNumber);
                        const isSelected = selectedSeats.includes(seatNumber);

                        return (
                          <button
                            key={seatNumber}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seatNumber)}
                            className={`seat ${isBooked ? "booked" : isSelected ? "selected" : "available"}`}
                            title={`Seat ${seatNumber} - ₹${config.price}`}
                          >
                            {isBooked ? "✕" : seatIndex}
                          </button>
                        );
                      })}
                    </div>

                    {/* Row Letter Right */}
                    <span className="w-5 text-center font-bold text-xs text-slate-400">
                      {rowLetter}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Seats Bar */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 w-full max-w-xl bg-emerald-950/40 border border-emerald-500/40 px-5 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Selected ({selectedSeats.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSeats.map(s => (
                <span
                  key={s}
                  onClick={() => onToggleSeat(s)}
                  className="bg-emerald-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded cursor-pointer hover:bg-rose-500 hover:text-white transition"
                  title="Click to remove"
                >
                  {s} ✕
                </span>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Max {maxSeats} seats</span>
        </div>
      )}
    </div>
  );
}

