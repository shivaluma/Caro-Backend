const argon = require('argon2');
const roomService = require('../services/RoomService');
const userService = require('../services/UserService');
const compare = require('../utils/compare');

module.exports = (socket, io) => {
  socket.on('create-room', async ({ user, option }) => {
    const roomId =
      socket.roomId ||
      roomService.rooms.findIndex(
        (r) =>
          r === null ||
          ((!r.owner || r.owner._id === user._id) &&
            r.firstPlayer === null &&
            r.secondPlayer === null &&
            !r.password &&
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
        move: [],
        ...option,
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
    // eslint-disable-next-line eqeqeq
    if (socket?.room?.roomId === roomId) return;

    socket.join(`room-${roomId}`);

    if (socket.room) {
      socket.room.people = socket.room.people.filter(
        (el) => el._id !== user._id,
      );
      socket.to(`room-${socket.room.roomId}`).emit('user-leave-room', user);
    }

    socket.room = roomService.rooms[roomId];
    if (!socket.room) return;
    socket.room.roomId = roomId;
    if (socket.room.people.findIndex((u) => u._id === user._id) === -1) {
      socket.room.people.push(user);
      socket.to(`room-${roomId}`).emit('user-join-room', user);
    }
  });

  socket.on('room-change', ({ board, roomId, next, lastTick, move }) => {
    const room = roomService.rooms[roomId];
    if (!room || !room.firstPlayer || !room.secondPlayer) return;
    const user = next ? room.secondPlayer : room.firstPlayer;
    if (move === 'reset') {
      socket.room.move = [];
    }
    socket.room.board = board;
    socket.room.next = next;
    socket.room.lastTick = lastTick;
    socket.room.userTurn = user;
    socket.room.move.push(lastTick);
    socket.join(`room-${roomId}`);
    io.to(`room-${roomId}`).emit('room-change-cli', {
      board,
      next,
      user,
      lastTick,
      move: socket.room.move,
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
    if (!room || !room.firstPlayer || !room.secondPlayer) return;
    let winner;
    let loser;
    if (lose) {
      if (lose._id)
        if (lose._id === room.firstPlayer._id) {
          loser = room.firstPlayer;
          winner = room.secondPlayer;
        } else {
          winner = room.firstPlayer;
          loser = room.secondPlayer;
        }
    } else {
      loser = next ? room.secondPlayer : room.firstPlayer;
      winner = next ? room.firstPlayer : room.secondPlayer;
    }
    socket.room.move.push(lastTick);
    roomService.createRoom(room, winner, board, socket.room.move);
    socket.room.chats = [];
    room.ready.firstPlayer = false;
    room.ready.secondPlayer = false;
    room.started = false;
    if (lose === 'draw') {
      userService.updateField(room.firstPlayer._id, {
        point: room.firstPlayer.point - 10,
        drawcount: room.firstPlayer.drawcount + 1,
      });
      userService.updateField(room.secondPlayer._id, {
        point: room.secondPlayer.point - 10,
        drawcount: room.secondPlayer.drawcount + 1,
      });
    } else {
      userService.updateField(winner._id, {
        point: winner.point + 25,
        wincount: winner.wincount + 1,
      });
      userService.updateField(loser._id, {
        point: loser.point - 25,
        losecount: loser.losecount + 1,
      });
    }
    socket.room.userTurn = null;
    socket.room.lastTick = lastTick;
    socket.room.board = board;
    if (lose === 'draw') {
      next = null;
    } else if (lose) {
      next = lose._id !== room.firstPlayer._id;
    }
    io.in(`room-${roomId}`).emit('game-end-cli', {
      board,
      next,
      lastTick,
      move: socket.room.move,
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
    socket.to(`room-${roomId}`).emit('claim-draw-cli');
  });

  socket.on('user-leave-room', ({ roomId, user }) => {
    socket.to(`room-${roomId}`).emit('user-leave-room', user);
    let { room } = socket;
    if (!room) room = roomService.rooms[roomId];
    if (!room) return;

    const index = room.people.findIndex((el) => el._id === user._id);
    if (index !== -1) room.people.splice(index, 1);
    if (room.people.length === 0) {
      setTimeout(() => {
        roomService.rooms[roomId] = null;
        room = null;
        io.emit('clear-room', roomId);
      }, 0);
    } else if (room.owner._id === user._id) {
      [room.owner] = room.people;
      socket.to(`room-${roomId}`).emit('room-owner-change', room.people[0]);
    }
    socket.room = null;
    socket.leave(`room-${roomId}`);
  });

  socket.on('quick-match', async ({ user, option }) => {
    let roomId = null;
    if (!io.quickMatch) {
      io.quickMatch = [];
    }
    if (io.quickMatch.findIndex((el) => el._id === user._id) === -1) {
      await io.quickMatch.push(user);
      io.quickMatch.sort(compare);
    }
    const users = [];

    if (io.quickMatch.length >= 2) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < io.quickMatch.length - 1; i++) {
        if (io.quickMatch[i + 1].point - io.quickMatch[i].point <= 50) {
          const user1 = io.quickMatch[i + 1];
          const user2 = io.quickMatch[i];
          users.push(user1);
          users.push(user2);

          roomId =
            socket.roomId ||
            roomService.rooms.findIndex(
              (r) =>
                r === null ||
                ((!r.owner || r.owner._id === user._id) &&
                  r.firstPlayer === null &&
                  r.secondPlayer === null &&
                  !r.password &&
                  !option.password),
            );
          if (!roomService.rooms[roomId]) {
            roomService.rooms[roomId] = {
              firstPlayer: null,
              secondPlayer: null,
              roomId,
              chats: [],
              owner: user1,
              people: [user1, user2],
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
              move: [],
              ...option,
            };
          }
          io.quickMatch = io.quickMatch.filter(
            (el) => el._id !== user1._id && el._id !== user2._id,
          );

          break;
        }
      }
    }

    io.emit('quick-match-cli', { roomId, users });
  });

  socket.on('cancel-quick-match', async ({ user }) => {
    io.quickMatch = io.quickMatch.filter((el) => el._id !== user._id);
  });
};
