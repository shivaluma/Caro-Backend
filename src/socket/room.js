const argon = require('argon2');
const roomService = require('../services/RoomService');
const userService = require('../services/UserService');

const timeOutMap = {};

module.exports = (socket, io) => {
  socket.on('create-room', async ({ user, option }) => {
    const roomId =
      socket.roomId ||
      roomService.rooms.findIndex(
        (r) =>
          r === null ||
          (r.firstPlayer === null &&
            r.secondPlayer === null &&
            !option.password),
      );
    if (!roomService.rooms[roomId]) {
      if (option.password) {
        option.password = await argon.hash(option.password);
      }
      roomService.rooms[roomId] = {
        firstPlayer: null,
        secondPlayer: null,
        roomId,
        chats: [],
        owner: user,
        people: [user],
        board: null,
        createdAt: new Date(),
        userTurn: null,
        next: null,
        lastTick: null,
        started: false,
        rules: {
          min: 5,
        },
        ready: {
          firstPlayer: false,
          secondPlayer: false,
        },
        ...option,
      };
    }

    clearTimeout(timeOutMap[Number[roomId]]);

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
    if (!socket.room) return;
    if (socket.room.people.findIndex((u) => u._id === user._id) === -1) {
      socket.room.people.push(user);
      socket.to(`room-${roomId}`).emit('user-join-room', user);
    }
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

  socket.on('game-end', ({ board, roomId, next, lastTick, lose }) => {
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
    socket.room.userTurn = null;
    socket.room.lastTick = lastTick;
    socket.room.board = board;
    if (lose) lastTick = lose._id === room.firstPlayer._id ? 'X' : 'O';
    io.to(`room-${roomId}`).emit('game-ended', {
      board,
      next,
      lastTick,
    });
  });

  socket.on('change-side', ({ roomId, user, side }) => {
    let leaveSide = null;
    socket.roomId = roomId;
    if (!roomService.rooms[roomId]) return;
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

  socket.on('claim-draw', ({ roomId }) => {
    socket.to(`room-${roomId}`).emit('claim-draw-cli', { test: 'alo' });
  });

  socket.on('user-leave-room', ({ roomId, user }) => {
    socket.to(`room-${roomId}`).emit('user-leave-room', user);
    let { room } = socket;
    if (!room) room = roomService.rooms[roomId];
    if (!room) return;
    const index = room.people.findIndex((el) => el._id === user._id);
    if (index !== -1) room.people.splice(index, 1);
    if (room.people.length === 0) {
      timeOutMap[Number(roomId)] = setTimeout(() => {
        roomService.rooms[roomId] = null;
        room = null;
        io.emit('clear-room', roomId);
      }, 0);
    }
    socket.room = null;
    socket.leave(`room-${roomId}`);
  });
};
