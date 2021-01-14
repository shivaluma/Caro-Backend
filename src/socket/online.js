const redis = require('../config/redis');
const roomService = require('../services/RoomService');
const { addUser, removeUser } = require('../services/OnlineService');

module.exports = (socket, io) => {
  socket.on('user-online', async (user) => {
    await addUser(user);
    socket.broadcast.emit('user-change', {
      online: true,
      data: user,
    });

    socket.user = user;

    await redis.setAsync(`users:${user._id}`, socket.id, 'NX', 'EX', 30);
  });

  socket.on('game-invite', async ({ roomId, userId, inviteName }) => {
    socket.broadcast.emit('game-invite', { roomId, inviteName, userId });
    // integrateio.to(socketId).emit('game-invite', { roomId, inviteName });
  });

  socket.on('user-offline', async (user) => {
    socket.broadcast.emit('user-change', {
      online: false,
      data: user,
    });

    socket.user = null;
    await redis.delAsync(`users:${user._id}`);

    // let roomId = null;

    // if (socket.room && Number.isInteger(socket.room.roomId)) {
    //   roomId = socket.room.roomId;
    // }

    // if (Number.isInteger(roomId)) {
    //   socket.to(`room-${roomId}`).emit('user-leave-room', user);
    //   let { room } = socket;
    //   if (!room) room = roomService.rooms[roomId];
    //   if (!room) return;

    //   const index = room.people.findIndex((el) => el._id === user._id);

    //   if (index !== -1) room.people.splice(index, 1);
    //   if (room.people.length === 0) {
    //     setTimeout(() => {
    //       roomService.rooms[roomId] = null;
    //       room = null;
    //       io.emit('clear-room', roomId);
    //     }, 0);
    //   }

    //   if (room.people.length > 0) {
    //     if (room.owner._id === user._id) {
    //       [room.owner] = room.people;
    //       socket.to(`room-${roomId}`).emit('room-owner-change', room.people[0]);
    //     }

    //     if (room.firstPlayer && room.firstPlayer._id === user._id) {
    //       socket.to(`room-${roomId}`).emit('player-change-side', {
    //         user,

    //         side: null,
    //         leaveSide: 1,
    //         userTurn: null,
    //       });

    //       room.firstPlayer = null;
    //     }

    //     if (room.secondPlayer && room.secondPlayer._id === user._id) {
    //       socket.to(`room-${roomId}`).emit('player-change-side', {
    //         user,
    //         roomId,
    //         side: null,
    //         leaveSide: 2,
    //         userTurn: null,
    //       });

    //       room.secondPlayer = null;
    //     }
    //   }

    //   socket.room = null;
    //   socket.leave(`room-${roomId}`);
    // }

    removeUser(user);
  });
};
