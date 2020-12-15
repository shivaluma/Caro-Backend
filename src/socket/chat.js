const useronline = require('../services/OnlineService');

module.exports = (socket) => {
  socket.on('user-offline', (email) => {
    useronline.delete(email);
    socket.broadcast.emit('user-change', {
      online: false,
      data: { email },
    });
  });
};
