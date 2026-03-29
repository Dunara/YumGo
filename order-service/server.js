const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/", (req, res) => {
  res.send("Order Service Running");
});

const PORT = 8003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});