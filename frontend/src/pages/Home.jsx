import React, { useState, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import { Sparkles, Film, Flame, Play, Volume2, ShieldCheck, Award } from "lucide-react";

export default function Home({ movies, onSelectMovie, searchQuery, loading }) {
  const [activeTab, setActiveTab] = useState("now_showing");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const genres = ["All", "Action", "Sci-Fi", "Drama", "Animation", "Adventure", "Crime"];

  // Filter movies by tab, genre, and search
  const filteredMovies = useMemo(() => {
    return movies.filter(m => {
      // Tab filter
      if (activeTab === "now_showing" && m.status !== "now_showing") return false;
      if (activeTab === "coming_soon" && m.status !== "coming_soon") return false;

      // Genre filter
      if (selectedGenre !== "All" && (!m.genre || !m.genre.includes(selectedGenre))) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchGenre = (m.genre || []).some(g => g.toLowerCase().includes(q));
        const matchCast = (m.cast || []).some(c => c.toLowerCase().includes(q));
        if (!matchTitle && !matchGenre && !matchCast) return false;
      }

      return true;
    });
  }, [movies, activeTab, selectedGenre, searchQuery]);

  // Featured Movie for Hero Banner
  const featuredMovie = movies.find(m => m.title.includes("Dune")) || movies[0];

  return (
    <div className="space-y-10">
      {/* Hero Showcase Banner */}
      {featuredMovie && !searchQuery && (
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="relative aspect-[21/9] min-h-[320px] sm:min-h-[400px] w-full">
            <img
              src={featuredMovie.banner || featuredMovie.poster}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Multi-layered cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/80 to-transparent" />

            {/* Banner Content */}
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-slate-950" /> Featured Movie
                </span>
                <span className="text-xs bg-slate-900/90 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  {featuredMovie.language || "English"}
                </span>
              </div>

              <h1 className="font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                {featuredMovie.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {featuredMovie.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onSelectMovie(featuredMovie)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  Book Tickets
                </button>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span>⭐ {featuredMovie.rating}/10</span>
                  <span>•</span>
                  <span>{featuredMovie.duration} mins</span>
                  <span>•</span>
                  <span>{featuredMovie.certificate || "UA"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Genre Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Main Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("now_showing")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === "now_showing"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Film className="w-4 h-4" />
              Now Showing ({movies.filter(m => m.status === "now_showing").length})
            </button>

            <button
              onClick={() => setActiveTab("coming_soon")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === "coming_soon"
                  ? "bg-rose-500 text-white shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Coming Soon ({movies.filter(m => m.status === "coming_soon").length})
            </button>
          </div>

          {/* Genre Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedGenre === genre
                    ? "bg-slate-700 text-white border border-slate-500"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading cinema movies...</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <Film className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No movies found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or selecting a different genre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie._id || movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
            />
          ))}
        </div>
      )}

      {/* Multiplex Amenities Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 flex-shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Dolby Atmos Sound</h4>
            <p className="text-xs text-slate-400 mt-1">
              Crystal-clear surround sound delivering an authentic cinema experience.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">4K Laser Projection</h4>
            <p className="text-xs text-slate-400 mt-1">
              High definition vivid colors and deep contrasts on the big screen.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Easy Ticket Booking</h4>
            <p className="text-xs text-slate-400 mt-1">
              Pick your seats, confirm in seconds, and show your booking ID at entry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
