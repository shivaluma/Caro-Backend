const roomService = require('../services/RoomService');

module.exports = (socket) => {
  socket.on('create-room', () => {
    const roomId = roomService.rooms.findIndex((r) => r === null);
    roomService.rooms[roomId] = {
      firstPlayer: null,
      secondPlayer: null,
      roomId,
      
      createdAt: new Date(),
    };
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
<<<<<<< HEAD
    socket
      .to(roomId)
      .emit('user-join-room', { user, room: roomService.rooms[roomId] });
=======
    socket.join(`room-${roomId}`);

    socket.to(`room-${roomId}`).emit('user-join-room', user);
>>>>>>> f33b95f852d49f16ca918efd17b283145afac5d9
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
    socket
      .to(`room-${roomId}`)
      .emit('player-change-side', { user, roomId, side, leaveSide });
  });

  socket.on('leave-room', (roomId, user) => {});
};
