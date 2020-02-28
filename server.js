const io = require('socket.io')(7070);
const Message = require('./model/Message');
const User = require('./model/User');
const UserStatus = require('./model/UserStatus');

const users = [];

io.on('connection', socket => {
  const user = new User(socket.id, 'user' + Date.now(), UserStatus.CONNECTED);

  users.push(user);
  io.emit('users', user);
  console.log('Socket connected: ' + socket.id);

  socket.on('users:view', (data, callback) => callback(users));

  socket.on('messages:add', text => {
    const user = users.find(user => user.id === socket.id);
    io.emit('messages', new Message(user.name, text));
  });

  socket.on('disconnect', () => {
    const user = users.find(user => user.id === socket.id);

    users.splice(users.indexOf(user), 1);

    user.disconnect();
    io.emit('users', user);

    console.log('Socket disconnected: ' + socket.id);
  });
});
