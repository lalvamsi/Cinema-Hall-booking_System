// Local development entry point - imports app and starts the server
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🍿 Cinema Booking Backend running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🚀 API Docs: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
