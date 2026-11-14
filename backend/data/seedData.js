const sampleMovies = [
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    genre: ["Sci-Fi", "Adventure", "Action"],
    duration: 166,
    rating: 8.6,
    language: "English",
    releaseDate: "2024-03-01",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    banner: "https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
    status: "now_showing",
    certificate: "UA 16+"
  },
  {
    title: "Interstellar",
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    duration: 169,
    rating: 8.7,
    language: "English",
    releaseDate: "2014-11-07",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    banner: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    status: "now_showing",
    certificate: "UA"
  },
  {
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    genre: ["Biography", "Drama", "History"],
    duration: 180,
    rating: 8.9,
    language: "English",
    releaseDate: "2023-07-21",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    banner: "https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    status: "now_showing",
    certificate: "A"
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    genre: ["Animation", "Action", "Adventure"],
    duration: 140,
    rating: 8.7,
    language: "English",
    releaseDate: "2023-06-02",
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    banner: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    director: "Joaquim Dos Santos, Kemp Powers",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Daniel Kaluuya"],
    status: "now_showing",
    certificate: "U"
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime", "Drama"],
    duration: 152,
    rating: 9.0,
    language: "English",
    releaseDate: "2008-07-18",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    banner: "https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    status: "now_showing",
    certificate: "UA"
  },
  {
    title: "Avatar: The Way of Water",
    description: "Set more than a decade after the events of the first film, Jake Sully and Neytiri have formed a family and are doing everything to stay together.",
    genre: ["Sci-Fi", "Adventure", "Fantasy"],
    duration: 192,
    rating: 7.8,
    language: "English",
    releaseDate: "2022-12-16",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    banner: "https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    status: "now_showing",
    certificate: "UA"
  }
];

const screenList = [
  { name: "Audi 1 - Dolby Atmos 4K", type: "Dolby Atmos", totalRows: 8, seatsPerRow: 12 },
  { name: "Audi 2 - IMAX Laser 3D", type: "IMAX", totalRows: 8, seatsPerRow: 12 },
  { name: "Audi 3 - VIP Luxe Recliner", type: "VIP Luxe", totalRows: 8, seatsPerRow: 12 }
];

const defaultTicketPrices = {
  platinum: 350,
  gold: 250,
  silver: 180
};

// Generate shows for next 5 days
function generateSampleShows(movies) {
  const shows = [];
  const times = ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM", "11:15 PM"];
  
  // Format today, tomorrow, etc.
  for (let d = 0; d < 5; d++) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + d);
    const dateStr = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD

    movies.forEach((movie, mIndex) => {
      if (movie.status === "coming_soon") return; // Coming soon don't have active shows yet
      
      const screen = screenList[mIndex % screenList.length];
      
      // Give each movie 3-4 showtimes per day
      times.slice(0, 3 + (mIndex % 2)).forEach((time, tIndex) => {
        // Pre-book a few realistic seats for variety
        const preBooked = [];
        if (d === 0) {
          // Some pre-booked seats for today's shows
          const demoSeats = ["A4", "A5", "C6", "C7", "D3", "E9", "F4", "F5"];
          demoSeats.slice(0, 2 + ((mIndex + tIndex) % 5)).forEach(s => preBooked.push(s));
        }

        shows.push({
          movie: movie._id || movie.id,
          movieTitle: movie.title,
          screenName: screen.name,
          screenType: screen.type,
          showDate: dateStr,
          showTime: time,
          ticketPrices: defaultTicketPrices,
          bookedSeats: preBooked,
          totalSeats: 92
        });
      });
    });
  }

  return shows;
}

module.exports = {
  sampleMovies,
  screenList,
  defaultTicketPrices,
  generateSampleShows
};

