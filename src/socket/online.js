const redis = require('../config/redis');

const useronline = require('../services/OnlineService');

module.exports = (socket) => {
  socket.on('user-online', async (user) => {
    if (!useronline.has(user.email)) {
      useronline.add(user.email);
      socket.broadcast.emit('user-change', {
        online: true,
        data: { email: user.email },
      });
    }
    const res = await redis.setAsync(
      `users:${user.id}`,
      socket.id,
      'NX',
      'EX',
      30,
    );
  });

  socket.on('user-offline', async (user) => {
    useronline.delete(user.email);
    socket.broadcast.emit('user-change', {
      online: false,
      data: { email: user.email },
    });
    await redis.delAsync(`users:${user.id}`);
  });
};
