import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Star, Calendar, MapPin, Users, Ticket, AlertCircle } from "lucide-react";
import { fetchShows } from "../services/api";

export default function MovieDetail({ movie, onBack, onSelectShow }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  // Generate next 5 calendar dates for filtering
  const availableDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
    const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { dateStr, dayName, formatted };
  });

  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].dateStr);
    }
  }, []);

  useEffect(() => {
    if (!movie) return;
    const loadShows = async () => {
      setLoading(true);
      try {
        const data = await fetchShows(movie._id || movie.id, selectedDate);
        setShows(data);
      } catch (err) {
        console.error("Error loading shows:", err);
      } finally {
        setLoading(false);
      }
    };
    loadShows();
  }, [movie, selectedDate]);

  if (!movie) return null;

  // Group shows by screenName
  const screenGroups = shows.reduce((acc, show) => {
    const key = show.screenName;
    if (!acc[key]) {
      acc[key] = {
        screenName: show.screenName,
        screenType: show.screenType,
        shows: []
      };
    }
    acc[key].shows.push(show);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Movies
      </button>

      {/* Movie Details Hero Banner */}
      <div className="glass-panel overflow-hidden border border-slate-800">
        <div className="relative">
          {/* Banner Backdrop */}
          <div className="h-48 sm:h-72 w-full overflow-hidden bg-slate-900">
            <img
              src={movie.banner || movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover opacity-30 blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121927] via-[#121927]/80 to-transparent" />
          </div>

          {/* Foreground Movie Profile */}
          <div className="p-6 sm:p-8 -mt-28 sm:-mt-36 relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            {/* Poster Card */}
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-36 sm:w-52 aspect-[2/3] object-cover rounded-2xl shadow-2xl border-2 border-slate-700/80 flex-shrink-0"
            />

            {/* Info Column */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded uppercase">
                  {movie.certificate || "UA"}
                </span>
                <span className="bg-slate-800 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded border border-amber-400/20 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {movie.rating ? movie.rating.toFixed(1) : "8.5"}/10
                </span>
                <span className="text-xs bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700">
                  {movie.language || "English"}
                </span>
                <span className="text-xs bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {movie.duration} min
                </span>
              </div>

              <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
                {movie.title}
              </h1>

              {/* Genre Badges */}
              <div className="flex flex-wrap gap-1.5">
                {(movie.genre || ["Drama"]).map((g, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-800/60 text-slate-300 px-3 py-1 rounded-full border border-slate-700/50 font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {movie.description}
              </p>

              {/* Director & Cast */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Director:</span>
                  <span className="text-white font-semibold">{movie.director || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Starring:</span>
                  <span className="text-white font-semibold">
                    {(movie.cast || []).join(", ") || "Ensemble Cast"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Booking Section */}
      {movie.status === "coming_soon" ? (
        <div className="glass-panel p-8 text-center space-y-3">
          <Calendar className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="font-heading font-bold text-lg text-white">Advanced Booking Opens Soon</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            This movie is scheduled for theatrical release on {movie.releaseDate || "soon"}. Check back soon for ticket reservations!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Select Date & Showtime
            </h2>
            <span className="text-xs text-slate-400">Step 1 of 3</span>
          </div>

          {/* Date Selector Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
            {availableDates.map(item => (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[90px] py-2.5 px-3 rounded-2xl border transition-all ${
                  selectedDate === item.dateStr
                    ? "bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider">{item.dayName}</span>
                <span className="text-sm font-black">{item.formatted}</span>
              </button>
            ))}
          </div>

          {/* Available Screens & Showtimes List */}
          {loading ? (
            <div className="py-12 flex justify-center items-center text-slate-400 gap-2">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Fetching showtimes for this date...</span>
            </div>
          ) : Object.keys(screenGroups).length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs">No showtimes scheduled for this date.</p>
              <p className="text-[11px] text-slate-500">Please select another date above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.values(screenGroups).map(group => (
                <div
                  key={group.screenName}
                  className="glass-card p-5 space-y-4 border border-slate-800 hover:border-slate-700 transition"
                >
                  {/* Screen Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-white">
                          {group.screenName}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {group.screenType} Experience • 4K Laser & Atmos
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      From ₹{group.shows[0]?.ticketPrices?.silver || 180}
                    </span>
                  </div>

                  {/* Showtimes Pills */}
                  <div className="flex flex-wrap gap-3 pt-1">
                    {group.shows.map(show => {
                      const bookedCount = show.bookedSeats ? show.bookedSeats.length : 0;
                      const availableCount = (show.totalSeats || 92) - bookedCount;
                      const isFillingFast = availableCount < 30;

                      return (
                        <button
                          key={show._id || show.id}
                          onClick={() => onSelectShow(show)}
                          className="group relative flex flex-col items-center justify-center bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/80 rounded-xl px-4 py-2.5 transition transform hover:-translate-y-0.5 shadow-sm"
                        >
                          <span className="font-heading font-black text-sm text-emerald-400 group-hover:text-amber-400 transition">
                            {show.showTime}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {isFillingFast ? (
                              <span className="text-rose-400 font-semibold">Only {availableCount} left</span>
                            ) : (
                              <span>{availableCount} seats left</span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
