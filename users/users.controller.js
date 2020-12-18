const express = require('express');

const router = express.Router();
const userService = require('./users.service');

function register(req, res, next) {
  userService
    .register(req.body)
    .then((user) => {
      res.status(user.status).json(user.message);
    })
    .catch((err) => next(err));
}

function login(req, res, next) {
  userService
    .login(req.body)
    .then((user) => {
      res.status(user.status).json(user.message);
    })
    .catch((err) => next(err));
}

router.post('/register', register);
router.post('/login', login);

module.exports = router;
