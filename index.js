const PORT = process.env.PORT || 8900;
const io = require("socket.io")(PORT, {
  cors: {
    origin: "*",
    // origin: "http://192.168.76.2:8081",
  },
});

// LIST OF ONLINE BUYERS/FARMERS
let onlineUsers = [];

// ADD A BUYER TO THE ARRAY OF ONLINE USERS WHEN HE GETS ONLINE
const addUser = (userId, socketId) => {
  //userId will be buyerId or farmerId
  !onlineUsers?.some((user) => user.userId === userId) &&
    onlineUsers?.push({ userId, socketId });
};

// REMOVE USER FROM ONLINE USERS WHEN HE DISCONNECTS
const removeUser = (socketId) => {
  onlineUsers = onlineUsers?.filter((user) => user.socketId !== socketId);
};

// GET A USER BY USERID
const getUser = (userId) => {
  return onlineUsers?.find((user) => user.userId === userId);
};

// CONNECT
io.on("connection", (socket) => {
  // Log the socket ID when a new client connects
  console.log("Client connected", socket.id);

  // Emit event to client
  io.emit("notification", "Hello guys, notification event emmited!");

  // ADD NEW USER
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  // GETTING A NEW NOTIFICATION FROM CLIENT(FARMER)
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
  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Log when a client disconnects
    removeUser(socket.id);
    socket.disconnect();
  });
});
