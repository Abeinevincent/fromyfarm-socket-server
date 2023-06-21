/**
 * swaggerconfig.js
 */

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  // Swagger definition
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fromy Farm Socket Server Documentation",
      version: "1.0.0",
      description: `Socket server implementation for a mobile app for connecting farmers and buyers across the globe with real time communication`,
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
