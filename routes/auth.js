const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Авторизація та реєстрація користувачів
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Ім'я користувача
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Пароль користувача
 *     responses:
 *       201:
 *         description: Користувача зареєстровано успішно
 *       400:
 *         description: Помилка реєстрації
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "Користувача зареєстровано успішно!" });
  } catch (error) {
    res.status(400).json({ message: "Помилка реєстрації", error });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Ім'я користувача
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Пароль користувача
 *     responses:
 *       200:
 *         description: Вхід успішний
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Вхід успішний!
 *                 token:
 *                   type: string
 *                   description: JWT токен
 *       400:
 *         description: Неправильний логін або пароль
 *       500:
 *         description: Помилка сервера
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Неправильний логін або пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неправильний логін або пароль" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Вхід успішний!", token });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error });
  }
});

module.exports = router;
