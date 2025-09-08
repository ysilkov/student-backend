const express = require("express");
const router = express.Router();
const AcademicPlan = require("../models/academicPlan");

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
      .populate("student", "-__v")
      .populate("subject", "-__v");

    if (plan == null) {
      return res.status(404).json({ message: "Навчальний план не знайдено" });
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
router.get("/", async (req, res) => {
  try {
    const plans = await AcademicPlan.find()
      .populate("student", "-__v")
      .populate("subject", "-__v");
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

router.patch("/:id", getAcademicPlan, async (req, res) => {
  try {
    const plan = await AcademicPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Academic plan not found" });
    }
    plan.finalGrade =
      req.body.finalGrade !== undefined ? req.body.finalGrade : null;

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
