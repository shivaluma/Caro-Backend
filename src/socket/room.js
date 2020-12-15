const useronline = require('../services/OnlineService');
const roomService = require('../services/RoomService');

const playerInRoom = {};

module.exports = (socket) => {
  socket.on('create-room', () => {
    const roomId = roomService.rooms.findIndex((r) => r === null);
    roomService.rooms[roomId] = {
      firstPlayer: null,
      secondPlayer: null,
      roomId,
      createdAt: new Date(),
    };
    socket.emit('created-room-info', {
      room: roomService.rooms[roomId],
    });

    socket.broadcast.emit('new-room', {
      room: roomService.rooms[roomId],
    });
  });

  socket.on('join-room', ({ roomId, user }) => {
    socket.to(roomId).emit('user-join-room', user);
  });

  socket.on('change-side', ({ roomId, user, side }) => {
    if (side === 'x') {
      roomService.rooms[roomId].firstPlayer = user;
    } else if (side === 'o') {
      roomService.rooms[roomId].secondPlayer = user;
    } else {
      if (
        roomService.rooms[roomId].firstPlayer &&
        roomService.rooms[roomId].firstPlayer.id === user.id
      ) {
        roomService.rooms[roomId].firstPlayer = null;
      }
      if (
        roomService.rooms[roomId].secondPlayer &&
        roomService.rooms[roomId].secondPlayer.id === user.id
      ) {
        roomService.rooms[roomId].secondPlayer = null;
      }
    }
    socket.to(roomId).emit('player-change-side', { user, roomId, side });
  });

  socket.on('leave-room', (roomId, playerId) => {});
};