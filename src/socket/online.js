const redis = require('../config/redis');

const { addUser, removeUser } = require('../services/OnlineService');

module.exports = (socket) => {
  socket.on('user-online', async (user) => {
    await addUser(user);
    socket.broadcast.emit('user-change', {
      online: true,
      data: user,
    });

    socket.user = user;

    await redis.setAsync(`users:${user._id}`, socket.id, 'NX', 'EX', 30);
  });

  socket.on('user-offline', async (user) => {
    socket.broadcast.emit('user-change', {
      online: false,
      data: user,
    });
    socket.user = null;
    await redis.delAsync(`users:${user._id}`);

    removeUser(user);
  });
};
