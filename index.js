/**
 * Socket Server
 *
 * This is a socket server implementation using Socket.IO.
 */

// const PORT = process.env.PORT || 8900;
const express = require("express");
const app = express();
// SWAGGER UI
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./swaggerconfig");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

/**
 * @swagger
 * tags:
 *   name: Socket Server
 *   description: Socket server endpoints
 */

// CONNECT
io.on("connection", (socket) => {
  // Log the socket ID when a new client connects

  console.log("Client connected", socket.id); // log when client connects

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Log when a client disconnects
    socket.disconnect();
  });
});

// Serve the Swagger API documentation
app.use("/ss/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 8900;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
