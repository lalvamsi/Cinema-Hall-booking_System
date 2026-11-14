import React, { useState, useEffect } from "react";
import { Shield, DollarSign, Ticket, Film, Calendar, Plus, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { fetchAdminStats, fetchBookings, createMovie, createShow, fetchMovies } from "../services/api";

export default function AdminDashboard({ onRefreshData }) {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showAddShowModal, setShowAddShowModal] = useState(false);
  const [notification, setNotification] = useState("");

  // New Movie Form State
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    genre: "Action, Sci-Fi",
    duration: 150,
    rating: 8.5,
    language: "English",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    director: "",
    cast: "",
    status: "now_showing",
    certificate: "UA"
  });

  // New Show Form State
  const [newShow, setNewShow] = useState({
    movieId: "",
    screenName: "Audi 1 - Dolby Atmos 4K",
    screenType: "Dolby Atmos",
    showDate: new Date().toISOString().split("T")[0],
    showTime: "07:00 PM"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, b, m] = await Promise.all([
        fetchAdminStats(),
        fetchBookings(),
        fetchMovies()
      ]);
      setStats(s);
      setBookings(b);
      setMovies(m);
      if (m.length > 0 && !newShow.movieId) {
        setNewShow(prev => ({ ...prev, movieId: m[0]._id || m[0].id }));
      }
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      await createMovie(newMovie);
      setShowAddMovieModal(false);
      setNotification("Movie added successfully to multiplex catalog!");
      setTimeout(() => setNotification(""), 5000);
      loadData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert(err.message || "Failed to add movie");
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      await createShow(newShow);
      setShowAddShowModal(false);
      setNotification("New showtime scheduled successfully!");
      setTimeout(() => setNotification(""), 5000);
      loadData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert(err.message || "Failed to schedule show");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-heading font-black text-2xl text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            Cinema Administration Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multiplex operations: metrics, catalog management, show scheduling, and booking audit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddMovieModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Movie
          </button>
          <button
            onClick={() => setShowAddShowModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition border border-slate-700 flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-amber-400" /> Schedule Show
          </button>
          <button
            onClick={loadData}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white border border-slate-800 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-heading font-black text-2xl text-white">
            ₹{stats ? stats.totalRevenue.toLocaleString() : "0"}
          </p>
          <span className="text-[11px] text-emerald-400">● Gross Ticket Sales</span>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tickets Sold</span>
            <Ticket className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-heading font-black text-2xl text-white">
            {stats ? stats.totalSeatsBooked : 0}
          </p>
          <span className="text-[11px] text-slate-400">{stats ? stats.totalConfirmedBookings : 0} confirmed orders</span>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Shows</span>
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>
          <p className="font-heading font-black text-2xl text-white">
            {stats ? stats.totalShows : 0}
          </p>
          <span className="text-[11px] text-slate-400">Across 3 multiplex screens</span>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Movies</span>
            <Film className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="font-heading font-black text-2xl text-white">
            {stats ? stats.totalMovies : 0}
          </p>
          <span className="text-[11px] text-slate-400">Now showing & upcoming</span>
        </div>
      </div>

      {/* Recent Bookings Audit Table */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
          <Ticket className="w-4 h-4 text-amber-400" />
          Recent Cinema Hall Bookings
        </h2>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading booking records...</div>
        ) : bookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">No bookings recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Movie & Screen</th>
                  <th className="py-3 px-4">Showtime</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.slice(0, 10).map(b => (
                  <tr key={b._id || b.id || b.bookingId} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{b.bookingId}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{b.movieTitle}</div>
                      <div className="text-[10px] text-slate-400">{b.screenName}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {b.showDate} <span className="text-slate-400">({b.showTime})</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(b.seats || []).map(s => (
                          <span key={s} className="bg-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{b.customerName}</div>
                      <div className="text-[10px] text-slate-400">{b.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">₹{b.totalAmount}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        b.status === "Cancelled"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto border border-slate-700">
            <h3 className="font-heading font-black text-lg text-white mb-4">Add New Movie</h3>
            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="e.g. Gladiator II"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Synopsis / Description</label>
                <textarea
                  required
                  rows={3}
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                  placeholder="Enter synopsis..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Rating (e.g. 8.5)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Status</label>
                  <select
                    value={newMovie.status}
                    onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Poster Image URL</label>
                <input
                  type="url"
                  required
                  value={newMovie.poster}
                  onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMovieModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Show Modal */}
      {showAddShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 border border-slate-700">
            <h3 className="font-heading font-black text-lg text-white mb-4">Schedule Showtime</h3>
            <form onSubmit={handleCreateShow} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Movie</label>
                <select
                  value={newShow.movieId}
                  onChange={(e) => setNewShow({ ...newShow, movieId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {movies.map(m => (
                    <option key={m._id || m.id} value={m._id || m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Cinema Screen / Audi</label>
                <select
                  value={newShow.screenName}
                  onChange={(e) => setNewShow({ ...newShow, screenName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Audi 1 - Dolby Atmos 4K">Audi 1 - Dolby Atmos 4K</option>
                  <option value="Audi 2 - IMAX Laser 3D">Audi 2 - IMAX Laser 3D</option>
                  <option value="Audi 3 - VIP Luxe Recliner">Audi 3 - VIP Luxe Recliner</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Show Date</label>
                  <input
                    type="date"
                    required
                    value={newShow.showDate}
                    onChange={(e) => setNewShow({ ...newShow, showDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Show Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 07:30 PM"
                    value={newShow.showTime}
                    onChange={(e) => setNewShow({ ...newShow, showTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Schedule Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

