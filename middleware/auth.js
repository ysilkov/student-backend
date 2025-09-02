const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Доступ заборонено. Немає токена.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Додаємо дані користувача до об'єкта запиту
    next();
  } catch (error) {
    res.status(401).json({ message: 'Недійсний токен.' });
  }
};