module.exports = (socket, io) => {
  socket.on('user-send-message', ({ roomId, content, user }) => {
    if (socket.room) socket.room.chats.push({ sender: user, content });
    io.to(`room-${roomId}`).emit('new-chat-message', { sender: user, content });
  });
};
