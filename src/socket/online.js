const useronline = require('../services/OnlineService');

module.exports = (socket) => {
  socket.on('user-online', (email) => {
    if (!useronline.has(email)) {
      useronline.add(email);
      socket.broadcast.emit('user-change', {
        online: true,
        data: { email },
      });
    }
  });

  socket.on('user-offline', (email) => {
    useronline.delete(email);
    socket.broadcast.emit('user-change', {
      online: false,
      data: { email },
    });
  });
};
