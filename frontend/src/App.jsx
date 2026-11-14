import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import { fetchMovies } from "./services/api";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectShow = (show) => {
    setSelectedShow(show);
    setCurrentView("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToMovies = () => {
    setSelectedMovie(null);
    setSelectedShow(null);
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewAllBookings = () => {
    setCurrentView("my-bookings");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e17] text-slate-100">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {currentView === "home" && (
          <Home
            movies={movies}
            onSelectMovie={handleSelectMovie}
            searchQuery={searchQuery}
            loading={loading}
          />
        )}

        {currentView === "detail" && (
          <MovieDetail
            movie={selectedMovie}
            onBack={handleBackToMovies}
            onSelectShow={handleSelectShow}
          />
        )}

        {currentView === "booking" && (
          <BookingPage
            show={selectedShow}
            movie={selectedMovie}
            onBack={() => setCurrentView("detail")}
            onViewAllBookings={handleViewAllBookings}
          />
        )}

        {currentView === "my-bookings" && (
          <MyBookings
            onBookMovie={handleBackToMovies}
          />
        )}

        {currentView === "admin" && (
          <AdminDashboard
            onRefreshData={loadMovies}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
