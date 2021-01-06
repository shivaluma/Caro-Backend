const roomService = require('../services/RoomService');
const userService = require('../services/UserService');

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
        userTurn: null,
        next: null,
        lastTick: null,
        started: false,
        ready: {
          firstPlayer: false,
          secondPlayer: false,
        },
      };
    }
    socket.emit('created-room-info', {
      room: roomService.rooms[roomId],
    });

    // socket.broadcast.emit('new-room', {
    //   room: roomService.rooms[roomId],
    // });
  });

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(`room-${roomId}`);
    socket.room = roomService.rooms[roomId];

    socket.to(`room-${roomId}`).emit('user-join-room', user);
  });

  socket.on('room-change', ({ board, roomId, next, lastTick }) => {
    const room = roomService.rooms[roomId];
    const user = next ? room.secondPlayer : room.firstPlayer;

    socket.room.board = board;
    socket.room.next = next;
    socket.room.lastTick = lastTick;
    socket.room.userTurn = user;
    socket.join(`room-${roomId}`);
    io.to(`room-${roomId}`).emit('room-changed', {
      board,
      next,
      user,
      lastTick,
    });
  });

  socket.on('press-start', ({ roomId, pos }) => {
    const room = roomService.rooms[Number(roomId)];
    if (pos === 1) {
      room.ready.firstPlayer = true;
    } else {
      room.ready.secondPlayer = true;
    }

    if (room.ready.firstPlayer && room.ready.secondPlayer) {
      room.started = true;
    }

    io.to(`room-${roomId}`).emit('press-start', { pos });
  });

  socket.on('game-end', ({ board, roomId, next, lastTick }) => {
    const room = roomService.rooms[roomId];
    socket.join(`room-${roomId}`);
    const winner = next ? room.firstPlayer : room.secondPlayer;
    const loser = next ? room.secondPlayer : room.firstPlayer;
    roomService.createRoom(room, winner, board);
    room.ready.firstPlayer = false;
    room.ready.secondPlayer = false;
    room.started = false;
    userService.updateField(winner._id, {
      point: winner.point + 25,
      wincount: winner.wincount + 1,
    });
    userService.updateField(loser._id, {
      point: loser.point - 25,
      wincount: loser.losecount + 1,
    });
    io.to(`room-${roomId}`).emit('game-ended', { board, next, lastTick });
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
    room.ready.firstPlayer = false;
    room.ready.secondPlayer = false;
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
