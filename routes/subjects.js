const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Управління предметами
 */

async function getSubject(req, res, next) {
  let subject;
  try {
    subject = await Subject.findById(req.params.id);
    if (subject == null) {
      return res.status(404).json({ message: 'Предмета не знайдено' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.subject = subject;
  next();
}

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Отримати список всіх предметів
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: Список предметів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       500:
 *         description: Помилка сервера
 */
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: Отримати предмет за ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID предмета
 *     responses:
 *       200:
 *         description: Успішно повертає предмет
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Предмет не знайдено
 *       500:
 *         description: Помилка сервера
 */
router.get('/:id', getSubject, (req, res) => {
  res.json(res.subject);
});

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Додати новий предмет
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: Предмет успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Некоректні дані
 */
router.post('/', async (req, res) => {
  const subject = new Subject({
    name: req.body.name,
    lecturesHours: req.body.lecturesHours,
    practiceHours: req.body.practiceHours,
    labHours: req.body.labHours,
  });

  try {
    const newSubject = await subject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/subjects/{id}:
 *   patch:
 *     summary: Оновити дані предмета
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID предмета
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: Успішно оновлено предмет
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Некоректні дані
 *       404:
 *         description: Предмет не знайдено
 */
router.patch('/:id', getSubject, async (req, res) => {
  if (req.body.name != null) res.subject.name = req.body.name;
  if (req.body.lecturesHours != null) res.subject.lecturesHours = req.body.lecturesHours;
  if (req.body.practiceHours != null) res.subject.practiceHours = req.body.practiceHours;
  if (req.body.labHours != null) res.subject.labHours = req.body.labHours;

  try {
    const updatedSubject = await res.subject.save();
    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/subjects/{id}:
 *   delete:
 *     summary: Видалити предмет за ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID предмета
 *     responses:
 *       200:
 *         description: Предмет успішно видалено
 *       404:
 *         description: Предмет не знайдено
 *       500:
 *         description: Помилка сервера
 */
router.delete('/:id', getSubject, async (req, res) => {
  try {
    await res.subject.deleteOne();
    res.json({ message: 'Предмет видалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;