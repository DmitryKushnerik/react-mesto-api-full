const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { urlTemplate } = require('../utils/validation');

// Краш-тест (удалить после ревью)
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Регистрация нового пользователя
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlTemplate),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// Вход в систему
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// Внешние роутеры
router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

// Неправильные URL
router.use('*', auth, (req, res, next) => {
  const err = new NotFoundError('Запрошенный URL не найден');
  next(err);
});

module.exports = router;
