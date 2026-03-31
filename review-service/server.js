// Load environment variables
require("dotenv").config();

// Import app and DB connection
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect to MongoDB
connectDB();

// Define PORT
const PORT = process.env.PORT || 3004;

// Start server
app.listen(PORT, () => {
  console.log(`Review Service running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});