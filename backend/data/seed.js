require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { connectDB } = require("../config/db");
const Movie = require("../models/Movie");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const { sampleMovies, generateSampleShows } = require("./seedData");

async function seedDatabase() {
  await connectDB();

  console.log("[Seeder] Clearing existing data...");
  await Movie.deleteMany({});
  await Show.deleteMany({});
  await Booking.deleteMany({});

  console.log("[Seeder] Inserting sample movies...");
  const insertedMovies = await Movie.insertMany(sampleMovies);
  console.log(`[Seeder] Inserted ${insertedMovies.length} movies.`);

  console.log("[Seeder] Generating shows for next 5 days...");
  const showsData = generateSampleShows(insertedMovies);
  const insertedShows = await Show.insertMany(showsData);
  console.log(`[Seeder] Inserted ${insertedShows.length} showtimes.`);

  console.log("[Seeder] Database successfully seeded with Cinema Hall data!");
  process.exit(0);
}

if (require.main === module) {
  seedDatabase().catch(err => {
    console.error("[Seeder Error]", err);
    process.exit(1);
  });
}

module.exports = seedDatabase;

