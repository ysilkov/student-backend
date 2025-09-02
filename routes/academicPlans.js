const express = require('express');
const router = express.Router();
const AcademicPlan = require('../models/academicPlan');
const Student = require('../models/student');
const Subject = require('../models/subject');

/**
 * @swagger
 * tags:
 *   - name: AcademicPlans
 *     description: Управління навчальними планами
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     AcademicPlan:
 *       type: object
 *       required:
 *         - student
 *         - subject
 *       properties:
 *         id:
 *           type: string
 *           description: ID навчального плану
 *         student:
 *           $ref: '#/components/schemas/Student'
 *         subject:
 *           $ref: '#/components/schemas/Subject'
 *         finalGrade:
 *           type: number
 *           description: Підсумкова оцінка
 */

async function getAcademicPlan(req, res, next) {
  let plan;
  try {
    plan = await AcademicPlan.findById(req.params.id)
      .populate('student', '-__v') // Заповнюємо дані студента
      .populate('subject', '-__v'); // Заповнюємо дані предмета
    
    if (plan == null) {
      return res.status(404).json({ message: 'Навчальний план не знайдено' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.plan = plan;
  next();
}

/**
 * @swagger
 * /api/academic-plans:
 *   get:
 *     summary: Отримати список всіх навчальних планів
 *     tags: [AcademicPlans]
 *     responses:
 *       200:
 *         description: Список навчальних планів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicPlan'
 *       500:
 *         description: Помилка сервера
 */
router.get('/', async (req, res) => {
  try {
    const plans = await AcademicPlan.find()
      .populate('student', '-__v')
      .populate('subject', '-__v');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/academic-plans/{id}:
 *   get:
 *     summary: Отримати навчальний план за ID
 *     tags: [AcademicPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID навчального плану
 *     responses:
 *       200:
 *         description: Навчальний план знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicPlan'
 *       404:
 *         description: Навчальний план не знайдено
 *       500:
 *         description: Помилка сервера
 */

router.get('/:id', getAcademicPlan, (req, res) => {
  res.json(res.plan);
});

/**
 * @swagger
 * /api/academic-plans:
 *   post:
 *     summary: Створити новий навчальний план
 *     tags: [AcademicPlans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: ID студента
 *               subjectId:
 *                 type: string
 *                 description: ID предмета
 *               finalGrade:
 *                 type: number
 *                 description: Підсумкова оцінка
 *     responses:
 *       201:
 *         description: Навчальний план створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicPlan'
 *       400:
 *         description: Некоректні дані
 */

router.post('/', async (req, res) => {
  const plan = new AcademicPlan({
    student: req.body.studentId,
    subject: req.body.subjectId,
    finalGrade: req.body.finalGrade,
  });

  try {
    const newPlan = await plan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/academic-plans/{id}:
 *   patch:
 *     summary: Оновити оцінку в навчальному плані
 *     tags: [AcademicPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID навчального плану
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               finalGrade:
 *                 type: number
 *                 description: Нова підсумкова оцінка
 *     responses:
 *       200:
 *         description: Навчальний план оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicPlan'
 *       400:
 *         description: Некоректні дані
 *       404:
 *         description: Навчальний план не знайдено
 */

router.patch('/:id', getAcademicPlan, async (req, res) => {
  if (req.body.finalGrade != null) {
    res.plan.finalGrade = req.body.finalGrade;
  }
  
  try {
    const updatedPlan = await res.plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/academic-plans/{id}:
 *   delete:
 *     summary: Видалити навчальний план
 *     tags: [AcademicPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID навчального плану
 *     responses:
 *       200:
 *         description: Навчальний план видалено
 *       404:
 *         description: Навчальний план не знайдено
 *       500:
 *         description: Помилка сервера
 */
router.delete('/:id', getAcademicPlan, async (req, res) => {
  try {
    await res.plan.deleteOne();
    res.json({ message: 'Навчальний план видалено' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;