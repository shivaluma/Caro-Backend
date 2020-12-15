module.exports = (socket) => {
  socket.on('new-chat-message', ({ roomId, message, userId }) => {
    socket.to(roomId).emit('new-chat-message', { message, userId });
  });
};
