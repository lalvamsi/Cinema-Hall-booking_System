import React from "react";
import { Star, Clock, Calendar, Ticket } from "lucide-react";

export default function MovieCard({ movie, onSelectMovie }) {
  const isComingSoon = movie.status === "coming_soon";

  return (
    <div 
      onClick={() => onSelectMovie(movie)}
      className="glass-card group flex flex-col overflow-hidden cursor-pointer hover:border-slate-600 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Certificate Badge */}
        {movie.certificate && (
          <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700/60 uppercase">
            {movie.certificate}
          </span>
        )}

        {/* Status Badge */}
        {isComingSoon ? (
          <span className="absolute top-2.5 right-2.5 bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded border border-rose-400/30 uppercase tracking-wide">
            Coming Soon
          </span>
        ) : (
          <span className="absolute top-2.5 right-2.5 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
            {movie.rating ? movie.rating.toFixed(1) : "8.5"}
          </span>
        )}

        {/* Duration & Language Pill */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-300 font-medium">
          <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800">
            <Clock className="w-3 h-3 text-amber-400" />
            {movie.duration}m
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800 text-slate-300">
            {movie.language || "English"}
          </span>
        </div>
      </div>

      {/* Movie Details Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-[#121927]">
        <div>
          <h3 className="font-heading font-bold text-base text-white group-hover:text-amber-400 transition line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {movie.description}
          </p>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1.5">
          {(movie.genre || ["Drama"]).slice(0, 3).map((g, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700/50"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            isComingSoon
              ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
              : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold group-hover:shadow-amber-500/25 group-hover:shadow-md"
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          {isComingSoon ? "View Details" : "Book Tickets"}
        </button>
      </div>
    </div>
  );
}
