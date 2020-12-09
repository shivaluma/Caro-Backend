const useronline = new Set();

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      socket.disconnect();
    });

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
  });
};

module.exports = {
  useronline,
  setupSocket,
};
