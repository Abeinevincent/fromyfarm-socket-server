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
    // origin: "http://192.168.76.2:8081",
  },
});

/**
 * @swagger
 * tags:
 *   name: Socket Server
 *   description: Socket server endpoints
 */

// LIST OF ONLINE BUYERS/FARMERS
let onlineUsers = [];

// ADD A BUYER TO THE ARRAY OF ONLINE USERS WHEN HE GETS ONLINE
/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Add a buyer to the array of online users when they get online.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: body
 *         required: true
 *         description: The user ID (buyerId or farmerId).
 *         schema:
 *           type: string
 *       - name: socketId
 *         in: body
 *         required: true
 *         description: The socket ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User added successfully
 */

const addUser = (userId, socketId) => {
  //userId will be buyerId or farmerId
  !onlineUsers?.some((user) => user.userId === userId) &&
    onlineUsers?.push({ userId, socketId });
};

// REMOVE USER FROM ONLINE USERS WHEN HE DISCONNECTS
/**
 * @swagger
 * /removeUser:
 *   delete:
 *     summary: Remove a user from the array of online users when they disconnect.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: socketId
 *         in: query
 *         required: true
 *         description: The socket ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User removed successfully.
 */
const removeUser = (socketId) => {
  onlineUsers = onlineUsers?.filter((user) => user.socketId !== socketId);
};

// GET A USER BY USERID
/**
 * @swagger
 * /getUser/{userId}:
 *   get:
 *     summary: Get a user from the array of online users by their user ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The user ID (buyerId or farmerId).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found successfully.
 *       404:
 *         description: User not found.
 */
const getUser = (userId) => {
  return onlineUsers?.find((user) => user.userId === userId);
};

/**
 * @swagger
 * /:
 *   get:
 *     summary: Start the socket server.
 *     tags: [Socket Server]
 *     responses:
 *       200:
 *         description: Socket server started successfully.
 *       500:
 *         description: Internal server error.
 */

// CONNECT
io.on("connection", (socket) => {
  // Log the socket ID when a new client connects

  /**
   * @swagger
   * /socket-server/connect:
   *   get:
   *     summary: Connect a client to the socket server.
   *     tags: [Socket Server]
   *     responses:
   *       200:
   *         description: Client connected successfully.
   */

  console.log("Client connected", socket.id);

  // Emit event to client

  /**
   * @swagger
   * /socket-server/notification:
   *   get:
   *     summary: Emit a notification event to all connected clients.
   *     tags: [Socket Server]
   *     responses:
   *       200:
   *         description: Notification event emitted successfully.
   */

  io.emit("notification", "Hello guys, notification event emmited!");

  // ADD NEW USER

  /**
   * @swagger
   * /socket-server/new-user:
   *   post:
   *     summary: Add a new user to the array of online users.
   *     tags: [Socket Server]
   *     requestBody:
   *       description: User ID.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 description: The user ID (buyerId or farmerId).
   *     responses:
   *       200:
   *         description: User added successfully.
   */

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  // GETTING A NEW NOTIFICATION FROM CLIENT(FARMER)

  /**
   * @swagger
   * /socket-server/send-notification:
   *   post:
   *     summary: Send a notification from a client (farmer) to a specific receiver.
   *     tags: [Socket Server]
   *     requestBody:
   *       description: Notification details.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               senderId:
   *                 type: string
   *                 description: The ID of the sender.
   *               receiverId:
   *                 type: string
   *                 description: The ID of the receiver.
   *               buyerId:
   *                 type: string
   *                 description: The ID of the buyer.
   *               farmerId:
   *                 type: string
   *                 description: The ID of the farmer.
   *               sendTo:
   *                 type: string
   *                 description: The recipient of the notification.
   *               itemname:
   *                 type: string
   *                 description: The name of the item.
   *               farmername:
   *                 type: string
   *                 description: The name of the farmer.
   *               message:
   *                 type: string
   *                 description: The notification message.
   *     responses:
   *       200:
   *         description: Notification sent successfully.
   */

  socket.on(
    "sendNotification",
    ({
      senderId,
      receiverId,
      buyerId,
      farmerId,
      sendTo,
      itemname,
      farmername,
      message,
    }) => {
      const receiver = getUser(receiverId);
      io.to(receiver?.socketId).emit("getNotification", {
        senderId,
        buyerId,
        farmerId,
        sendTo,
        itemname,
        farmername,
        message,
      });
    }
  );

  // GETTING A NEW NOTIFICATION FROM CLIENT(BUYER)

  /**
   * @swagger
   * /socket-server/send-notification-b:
   *   post:
   *     summary: Send a notification from a client (buyer) to a specific receiver.
   *     tags: [Socket Server]
   *     requestBody:
   *       description: Notification details.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               senderId:
   *                 type: string
   *                 description: The ID of the sender.
   *               receiverId:
   *                 type: string
   *                 description: The ID of the receiver.
   *               buyerId:
   *                 type: string
   *                 description: The ID of the buyer.
   *               farmerId:
   *                 type: string
   *                 description: The ID of the farmer.
   *               sendTo:
   *                 type: string
   *                 description: The recipient of the notification.
   *               itemname:
   *                 type: string
   *                 description: The name of the item.
   *               farmername:
   *                 type: string
   *                 description: The name of the farmer.
   *               message:
   *                 type: string
   *                 description: The notification message.
   *               buyerprice:
   *                 type: number
   *                 description: The price set by the buyer.
   *               quantitybuyerneeds:
   *                 type: number
   *                 description: The quantity the buyer needs.
   *     responses:
   *       200:
   *         description: Notification sent successfully.
   */

  socket.on(
    "sendNotificationB",
    ({
      senderId,
      receiverId,
      buyerId,
      farmerId,
      sendTo,
      itemname,
      farmername,
      message,
      buyerprice,
      quantitybuyerneeds,
    }) => {
      const receiver = getUser(receiverId);
      io.to(receiver?.socketId).emit("getNotificationB", {
        senderId,
        buyerId,
        farmerId,
        sendTo,
        itemname,
        farmername,
        message,
        buyerprice,
        quantitybuyerneeds,
      });
    }
  );

  // DISCONNECT

  /**
   * @swagger
   * /socket-server/disconnect:
   *   post:
   *     summary: Handle client disconnection.
   *     tags: [Socket Server]
   *     responses:
   *       200:
   *         description: Client disconnected successfully.
   */

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Log when a client disconnects
    removeUser(socket.id);
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
