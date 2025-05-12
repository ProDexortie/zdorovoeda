import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получаем данные пользователя, исключая пароль
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Несанкционированный доступ, токен не действителен' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Несанкционированный доступ, токен не найден' });
  }
};

// Middleware для проверки прав администратора
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Доступ запрещен, необходимы права администратора' });
  }
};