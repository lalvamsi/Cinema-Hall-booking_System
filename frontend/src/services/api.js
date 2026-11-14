const API_BASE = "/api";

export async function fetchMovies(status = "", search = "") {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/movies?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch movies");
  return data.data;
}

export async function fetchMovieById(id) {
  const res = await fetch(`${API_BASE}/movies/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch movie details");
  return data.data;
}

export async function fetchShows(movieId = "", date = "") {
  const params = new URLSearchParams();
  if (movieId) params.append("movieId", movieId);
  if (date) params.append("date", date);

  const res = await fetch(`${API_BASE}/shows?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch shows");
  return data.data;
}

export async function fetchShowById(id) {
  const res = await fetch(`${API_BASE}/shows/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch show details");
  return data.data;
}

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Booking failed");
  return data.data;
}

export async function fetchBookings(email = "", bookingId = "") {
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  if (bookingId) params.append("bookingId", bookingId);

  const res = await fetch(`${API_BASE}/bookings?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");
  return data.data;
}

export async function fetchBookingById(id) {
  const res = await fetch(`${API_BASE}/bookings/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Booking not found");
  return data.data;
}

export async function cancelBooking(id) {
  const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
    method: "PUT"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to cancel booking");
  return data.data;
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/bookings/admin/stats`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
  return data.data;
}

export async function createMovie(movieData) {
  const res = await fetch(`${API_BASE}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movieData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create movie");
  return data.data;
}

export async function createShow(showData) {
  const res = await fetch(`${API_BASE}/shows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(showData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to schedule show");
  return data.data;
}
