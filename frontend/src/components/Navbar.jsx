import React from "react";
import { Film, Ticket, Shield, Search, Sparkles } from "lucide-react";

export default function Navbar({ currentView, setCurrentView, searchQuery, setSearchQuery }) {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView("home")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                Cine<span className="text-amber-400">Pass</span>
              </span>
              <span className="text-[10px] font-bold bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/20 uppercase tracking-wider">
                Max
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block">
              Grand Multiplex Experience
            </p>
          </div>
        </div>

        {/* Search Bar (Centered / Right) */}
        {currentView === "home" && (
          <div className="relative hidden md:flex items-center flex-1 max-w-xs mx-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, genres..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentView("home")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              currentView === "home" || currentView === "detail" || currentView === "booking"
                ? "bg-slate-800 text-amber-400 shadow-sm border border-slate-700/60"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Movies</span>
          </button>

          <button
            onClick={() => setCurrentView("my-bookings")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              currentView === "my-bookings"
                ? "bg-slate-800 text-amber-400 shadow-sm border border-slate-700/60"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Tickets</span>
          </button>

          <button
            onClick={() => setCurrentView("admin")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              currentView === "admin"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
            title="Admin Console"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

