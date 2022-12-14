const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const AuthorisationError = require('../errors/AuthorisationError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UserExistsError = require('../errors/UserExistsError');

// Получить всех пользователей
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// Получить информацию о конкретном пользователе
function getInfoAboutUser(req, res, next, userID) {
  User.findById(userID)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Передан некорректный id пользователя'));
      }
      return next(err);
    });
}

// Получить информацию о пользователе по ID
module.exports.getUserById = (req, res, next) => {
  getInfoAboutUser(req, res, next, req.params.userId);
};

// Получить информацию об залогиненном пользователе
module.exports.getInfoAboutMe = (req, res, next) => {
  getInfoAboutUser(req, res, next, req.user._id);
};

// Создать нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const result = {
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
      };
      return res.send(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } if (err.code === 11000) {
        return next(new UserExistsError('Пользователь с указанным e-mail уже зарегистрирован'));
      }
      return next(err);
    });
};

// Обновить информацию о пользователе
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

// Обновить аватар пользователя
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

// Вход в систему
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new AuthorisationError('Произошла ошибка авторизации')));
};
