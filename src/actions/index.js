export const getUsers = socket => dispatch => {
  socket.emit('users:view', null, users => {
    dispatch({ type: 'FETCH_USERS', payload: users });
  });
}

export const sendMessage = (socket, message) => {
  socket.emit('messages:add', message);
}
