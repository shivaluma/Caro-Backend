const roomService = require('../services/RoomService');

module.exports = (socket, io) => {
  socket.on('create-room', ({ _id }) => {
    const roomId =
      socket.roomId ||
      roomService.rooms.findIndex(
        (r) =>
          r === null || (r.firstPlayer === null && r.secondPlayer === null),
      );
    if (!roomService.rooms[roomId]) {
      roomService.rooms[roomId] = {
        firstPlayer: null,
        secondPlayer: null,
        roomId,
        chats: [],
        board: null,
        createdAt: new Date(),
      };
    }
    socket.emit('created-room-info', {
      room: roomService.rooms[roomId],
    });

    socket.broadcast.emit('new-room', {
      room: roomService.rooms[roomId],
    });
  });

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(`room-${roomId}`);
    socket.room = roomService.rooms[roomId];

    socket.to(`room-${roomId}`).emit('user-join-room', user);
  });

  socket.on('room-change', ({ board, roomId, next }) => {
    console.log(next);
    const room = roomService.rooms[roomId];
    const user = next ? room.secondPlayer : room.firstPlayer;
    socket.join(`room-${roomId}`);
    io.to(`room-${roomId}`).emit('room-changed', { board, next, user });
  });

  socket.on('change-side', ({ roomId, user, side }) => {
    let leaveSide = null;
    socket.roomId = roomId;
    if (side === 1) {
      roomService.rooms[roomId].firstPlayer = user;
    } else if (side === 2) {
      roomService.rooms[roomId].secondPlayer = user;
    } else {
      if (
        roomService.rooms[roomId].firstPlayer &&
        roomService.rooms[roomId].firstPlayer._id === user._id
      ) {
        roomService.rooms[roomId].firstPlayer = null;
        leaveSide = 1;
      }
      if (
        roomService.rooms[roomId].secondPlayer &&
        roomService.rooms[roomId].secondPlayer._id === user._id
      ) {
        roomService.rooms[roomId].secondPlayer = null;
        leaveSide = 2;
      }
      socket.roomId = null;
    }
    const room = roomService.rooms[roomId];
    const userTurn = room.firstPlayer;
    socket
      .to(`room-${roomId}`)
      .emit('player-change-side', { user, roomId, side, leaveSide, userTurn });
  });

  socket.on('leave-room', (roomId, user) => {
    socket.join(`room-${roomId}`);

    socket.to(`room-${roomId}`).emit('user-join-room', user);
  });
};
