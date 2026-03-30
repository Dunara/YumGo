const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// SWAGGER CONFIG GOES HERE
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "Order Service Documentation",
    },
    servers: [
      {
        url: "http://localhost:8003",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// routes
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/", (req, res) => {
  res.send("Order Service Running");
});

const PORT = 8003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
