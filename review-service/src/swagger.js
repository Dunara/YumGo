const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const setupSwagger = (app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Review Service API",
        version: "1.0.0",
        description: "API documentation for Review Service",
      },
      servers: [
        {
          url: "http://localhost:3001",
          description: "Local server",
        },
      ],
    },
    apis: ["./src/routes/*.js"], // read swagger comments from routes
  };

  const specs = swaggerJsDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;