const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const LOCAL_DB_PATH = path.join(__dirname, "..", "data", "local_db.json");

let isMongoConnected = false;

// Ensure local db file exists
function ensureLocalDbFile() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const initialData = {
      movies: [],
      shows: [],
      bookings: []
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

function readLocalDb() {
  ensureLocalDbFile();
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[LocalDB] Error reading local_db.json, resetting...", err);
    return { movies: [], shows: [], bookings: [] };
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[LocalDB] Error writing local_db.json:", err);
  }
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cinema_booking";
  ensureLocalDbFile();

  try {
    console.log(`[MongoDB] Attempting to connect to: ${uri}`);
    mongoose.set("strictQuery", false);
    
    // Set low timeout so if Mongo is not running locally, server doesn't hang
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });

    isMongoConnected = true;
    console.log(`[MongoDB] Successfully connected to MongoDB database.`);
  } catch (error) {
    isMongoConnected = false;
    console.log("--------------------------------------------------");
    console.log("[Notice] MongoDB server not reachable at " + uri);
    console.log("[Storage] Seamlessly running in Persistent Local JSON Database mode.");
    console.log("[Storage] All operations (Movies, Shows, Bookings) work 100% out of the box!");
    console.log("--------------------------------------------------");
  }
};

module.exports = {
  connectDB,
  isMongo: () => isMongoConnected,
  readLocalDb,
  writeLocalDb
};
