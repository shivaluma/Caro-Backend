const online = require('./online');
const room = require('./room');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      socket.disconnect();
    });
    // integrate online module
    online(socket);
    room(socket, io);
  });
};

module.exports = {
  setupSocket,
};
