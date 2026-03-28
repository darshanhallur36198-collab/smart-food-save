let io;

exports.initSocket = (server) => {
  const socketIo = require("socket.io");
  io = socketIo(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("Client connected");
  });
};

exports.sendAlert = (message) => {
  if (io) {
    io.emit("alert", message);
  }
};