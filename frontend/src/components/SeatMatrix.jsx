import React from "react";

export default function SeatMatrix({
  show,
  selectedSeats,
  onToggleSeat
}) {
  const bookedSeats = show.bookedSeats || [];
  const ticketPrice = 200;

  // Simple 5 rows (A to E) with 8 seats per row
  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    onToggleSeat(seatId);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Simple Screen Indicator */}
      <div className="w-full max-w-md mb-8 text-center">
        <div className="w-full h-2 bg-slate-700 rounded-full mb-2" />
        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
          Screen This Way
        </span>
      </div>

      {/* Simple Seat Legend */}
      <div className="flex items-center justify-center gap-6 mb-6 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-800 border border-slate-600" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
            ✓
          </div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">
            ✕
          </div>
          <span>Booked</span>
        </div>
      </div>

      {/* Simple Seat Grid (Rows A to E, 1 to 8) */}
      <div className="space-y-3">
        {rows.map((rowLetter) => (
          <div key={rowLetter} className="flex items-center gap-2 sm:gap-3">
            {/* Row Letter */}
            <span className="w-5 text-center font-bold text-xs text-slate-400">
              {rowLetter}
            </span>

            {/* Seats 1 to 8 */}
            <div className="flex items-center gap-2">
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatNumber = `${rowLetter}${i + 1}`;
                const isBooked = bookedSeats.includes(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);

                return (
                  <button
                    key={seatNumber}
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleSeatClick(seatNumber)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                      isBooked
                        ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                        : isSelected
                        ? "bg-emerald-500 text-slate-950 font-bold shadow-md scale-105"
                        : "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {isBooked ? "✕" : i + 1}
                  </button>
                );
              })}
            </div>

            {/* Row Letter Right */}
            <span className="w-5 text-center font-bold text-xs text-slate-400">
              {rowLetter}
            </span>
          </div>
        ))}
      </div>

      {/* Selected Seats summary */}
      <div className="mt-6 text-center text-xs text-slate-300">
        <p className="font-medium text-amber-400">Ticket Price: ₹{ticketPrice} / seat</p>
        {selectedSeats.length > 0 && (
          <p className="mt-1 text-slate-300">
            Selected: <span className="font-bold text-white">{selectedSeats.join(", ")}</span> ({selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"})
          </p>
        )}
      </div>
    </div>
  );
}
