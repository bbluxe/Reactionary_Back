/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const db = require('../_helpers/db');

const { User } = db;

async function login(body) {
  if (body === undefined || body.pseudo === undefined || body.password === undefined) {
    return ({ message: 'Veuillez renseigner tout les champs', status: 400 });
  }
  const user = await User.findOne({ where: { pseudo: body.pseudo } });
  if (!user) {
    return ({ message: 'Veuillez vérifier votre pseudo', status: 400 });
  }
  const password = await bcrypt.compare(body.password, user.password);
  if (!password) {
    return ({ message: 'Veuillez vérifier votre mot de passe', status: 400 });
  }
  return ({ status: 200, message: { id: user._id, pseudo: user.pseudo } });
}

async function register(body) {
  if (body === undefined || body.pseudo === undefined || body.password === undefined) {
    return ({ message: 'Veuillez renseigner tout les champs', status: 400 });
  }
  const user = await User.findOne({ where: { pseudo: body.pseudo } });
  if (user) {
    return ({ message: 'Pseudo déjà utilisé', status: 400 });
  }
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(body.password, salt);
  const registeredUser = new User({ pseudo: body.pseudo, password }).save();
  return registeredUser
    .then(() => ({ message: 'Inscription réussie', status: 200 }))
    .catch((err) => ({ message: `Echec à l'inscription :${err}`, status: 400 }));
}

module.exports = {
  login,
  register,
};
