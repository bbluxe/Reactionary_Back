const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(port, () => console.log(`Application en cours d'exécution sur le port ${port}`));
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const db = require('./_helpers/db');

db.dbConnect();

let allUsers = [];
io.on('connection', (socket) => {
  const usersLogged = [];

  socket.once('join', (joinData) => {
    const joinedData = joinData;
    socket.join(joinData.room);
    allUsers.push(joinData);
    allUsers.forEach((element) => {
      if (element.room === joinData.room) {
        usersLogged.push(element);
      }
    });
    io.emit('joined', joinedData);
    io.in(joinData.room).emit('users', usersLogged);
  });

  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));

  socket.on('message', (data) => socket.to(data.room).emit('message', data));

  socket.once('leave', (leaveData) => {
    socket.leave(leaveData.room);
    allUsers = allUsers.filter((user) => {
      if (user.id !== leaveData.id) { return user; }
    });
    allUsers.forEach((element) => {
      if (element.room === leaveData.room) {
        usersLogged.push(element);
      }
    });
    io.in(leaveData.room).emit('users', usersLogged);
  });
});

app.get('/', (req, res) => res.send('Welcome to setting up Node.js project tutorial!'));
app.use('/users', require('./users/users.controller'));
