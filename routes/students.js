const express = require("express");
const router = express.Router();
const Student = require("../models/student");

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Управління даними студентів
 */

async function getStudent(req, res, next) {
  let student;
  try {
    student = await Student.findById(req.params.id);
    if (student == null) {
      return res.status(404).json({ message: "Студента не знайдено" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.student = student;
  next();
}

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Повертає список всіх студентів
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Успішно повертає список студентів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Помилка сервера
 */
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Повертає студента за ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID студента
 *     responses:
 *       200:
 *         description: Успішно повертає студента
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Студента не знайдено
 *       500:
 *         description: Помилка сервера
 */

router.get("/:id", getStudent, async (req, res) => {
  res.json(res.student);
});

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Додає нового студента
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Студента додано успішно
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Некоректні дані
 */

router.post("/", async (req, res) => {
  const student = new Student({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName,
    address: req.body.address,
    phone: req.body.phone,
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/students/{id}:
 *   patch:
 *     summary: Оновлює дані студента
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID студента для оновлення
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Дані студента успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Некоректні дані
 *       404:
 *         description: Студента не знайдено
 */

router.patch("/:id", getStudent, async (req, res) => {
  if (req.body.firstName != null) res.student.firstName = req.body.firstName;
  if (req.body.lastName != null) res.student.lastName = req.body.lastName;
  if (req.body.middleName != null) res.student.middleName = req.body.middleName;
  if (req.body.address != null) res.student.address = req.body.address;
  if (req.body.phone != null) res.student.phone = req.body.phone;

  try {
    const updatedStudent = await res.student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Видаляє студента за ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID студента для видалення
 *     responses:
 *       200:
 *         description: Студента успішно видалено
 *       404:
 *         description: Студента не знайдено
 *       500:
 *         description: Помилка сервера
 */

router.delete("/:id", getStudent, async (req, res) => {
  try {
    await res.student.deleteOne();
    res.json({ message: "Студента видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
