const express = require("express");
const router = express.Router();
const Subject = require("../models/subject");
const AcademicPlan = require("../models/academicPlan");
const mongoose = require("mongoose");

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
      return res.status(404).json({ message: "Предмета не знайдено" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.subject = subject;
  next();
}
/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Отримати список всіх предметів
 *     tags:
 *       - Subjects
 *     responses:
 *       200:
 *         description: Список предметів успішно отримано
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64f0e5a7c9f1c2a123456789
 *                   name:
 *                     type: string
 *                     example: Математика
 *       500:
 *         description: Виникла помилка на сервері
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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
router.get("/:id", async (req, res) => {
  try {
    const subjects = await Subject.find({ student: req.params.id });
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
router.get("/:id", getSubject, (req, res) => {
  res.json(res.subject);
});

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Додати новий предмет та створити академічний план для студента
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idStudent
 *               - name
 *               - lecturesVolume
 *               - practicesVolume
 *               - labsVolume
 *             properties:
 *               idStudent:
 *                 type: string
 *                 description: ID студента
 *                 example: 64f0e5a7c9f1c2a123456789
 *               name:
 *                 type: string
 *                 description: Назва предмету
 *                 example: Математика
 *               lecturesVolume:
 *                 type: number
 *                 description: Кількість годин лекцій
 *                 example: 30
 *               practicesVolume:
 *                 type: number
 *                 description: Кількість годин практичних занять
 *                 example: 20
 *               labsVolume:
 *                 type: number
 *                 description: Кількість годин лабораторних робіт
 *                 example: 10
 *     responses:
 *       201:
 *         description: Предмет та академічний план успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newSubject:
 *                   $ref: '#/components/schemas/Subject'
 *                 savedAcademicPlan:
 *                   $ref: '#/components/schemas/AcademicPlan'
 *       400:
 *         description: Некоректні дані або помилка при створенні
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Некоректні дані
 */
router.post("/", async (req, res) => {
  const subject = new Subject({
    student: new mongoose.Types.ObjectId(req.body.idStudent),
    name: req.body.name,
    lecturesHours: req.body.lecturesVolume,
    practiceHours: req.body.practicesVolume,
    labHours: req.body.labsVolume,
  });
  try {
    const newSubject = await subject.save();
    const academicPlan = new AcademicPlan({
      student: new mongoose.Types.ObjectId(req.body.idStudent),
      subject: newSubject._id,
      finalGrade: null,
    });

    const savedAcademicPlan = await academicPlan.save();
    res.status(201).json({ savedAcademicPlan, newSubject });
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
router.put("/:id", getSubject, async (req, res) => {
  if (req.body.idStudent != null) res.subject.idStudent = req.body.id;
  if (req.body.name != null) res.subject.name = req.body.name;
  if (req.body.lecturesVolume != null)
    res.subject.lecturesHours = req.body.lecturesVolume;
  if (req.body.practicesVolume != null)
    res.subject.practiceHours = req.body.practicesVolume;
  if (req.body.labsVolume != null) res.subject.labHours = req.body.labsVolume;

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
router.delete("/:id", getSubject, async (req, res) => {
  try {
    await res.subject.deleteOne();
    res.json({ message: "Предмет видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
