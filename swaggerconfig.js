/**
 * swaggerconfig.js
 */

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  // Swagger definition
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Scholar Track Socket Server Documentation",
      version: "1.0.0",
      description: `Socket server implementation for a mobile app for masters research students.`,
    },
    servers: [
      {
        url: "/ss/v1",
      },
    ],
  },
  // API routes
  apis: ["./index.js"], // Update with the path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
