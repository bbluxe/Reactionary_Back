const mongoose = require('mongoose');

function dbConnect() {
  mongoose.connect('mongodb://localhost:27017/reactionary_db', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
      console.log('Connexion à la DB réussie');
    })
    .catch((err) => {
      console.log('Echec connexion :', err);
    });
}

module.exports = {
  dbConnect,
};
