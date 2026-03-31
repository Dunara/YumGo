const express = require("express");
const reviewRoutes = require("./routes/reviewRoutes");
const setupSwagger = require("./swagger");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/reviews", reviewRoutes);

// Swagger
setupSwagger(app);

// Test route
app.get("/", (req, res) => {
  res.send("Review Service is running 🚀");
});

module.exports = app;