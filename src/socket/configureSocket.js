const online = require('./online');
const room = require('./room');
const chat = require('./chat');
const { removeUser } = require('../services/OnlineService');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      if (socket.user) {
        removeUser(socket.user);
      }

      socket.disconnect();
    });
    // integrate online module
    online(socket);
    room(socket, io);
    chat(socket, io);
  });
};

module.exports = {
  setupSocket,
};
