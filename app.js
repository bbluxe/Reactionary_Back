/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

const server = app.listen(port, () => console.log(`Application en cours d'exécution sur le port ${port}`));
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
// const db = require('./_helpers/db');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

// db.sequelize.sync({ force: false }).then(() => {
//   console.log("DB Create");
// });

let allUsers = [];
io.on('connection', (socket) => {
  let usersLogged = [];

  socket.on('join', (joinData) => {
    socket.join(joinData.room);
    allUsers.push(joinData);
    usersLogged = allUsers.filter((element) => {
      if (element.room === joinData.room) {
        return element;
      }
    });
    io.emit('joined', joinData);
    io.in(joinData.room).emit('message', { pseudo: joinData.pseudo, message: 'a rejoint le salon', date: joinData.date });
    io.in(joinData.room).emit('users', usersLogged);
    const rooms = [];

    allUsers.forEach((element) => {
      if (!rooms.includes(element.room)) {
        rooms.push(element.room);
      }
    });
    io.emit('rooms', rooms);
  });

  socket.on('getRooms', () => {
    const rooms = [];

    allUsers.forEach((element) => {
      if (!rooms.includes(element.room)) {
        rooms.push(element.room);
      }
    });
    io.emit('rooms', rooms);
  });

  socket.on('drawing', (data) => socket.to(data.room).emit('drawing', data.draw));

  socket.on('message', (data) => io.in(data.room).emit('message', data));

  socket.on('leave', (leaveData) => {
    socket.leave(leaveData.room);
    allUsers = allUsers.filter((user) => {
      if (user.idUser !== leaveData.idUser) {
        return user;
      }
    });
    usersLogged = allUsers.filter((element) => {
      if (element.room === leaveData.room) {
        return element;
      }
    });
    socket.to(leaveData.room).emit('message', { pseudo: leaveData.pseudo, message: 'a quitté le salon' });
    socket.to(leaveData.room).emit('users', usersLogged);
  });
});

app.get('/', (req, res) => res.send("Welcome on Reactionary's API"));
app.use('/users', require('./users/users.controller'));
