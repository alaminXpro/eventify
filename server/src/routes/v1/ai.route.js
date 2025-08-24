/**
 * @swagger
 * /ai/faq:
 *   get:
 *     tags:
 *       - AI management
 *     summary: Get FAQ greeting
 *     description: Returns a simple greeting message.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello world
 *   post:
 *     tags:
 *       - AI management
 *     summary: Submit a question to AI FAQ
 *     description: Submits a question to the AI FAQ endpoint.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "What is the event schedule?"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *       400:
 *         description: Validation error
 */
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const aiValidation = require('../../validations/ai.validation');
const aiController = require('../../controllers/ai.controller');

const router = express.Router();

router
  .route('/faq')
  .get((req, res) => res.status(200).json({ message: 'Hello world' }))
  .post(auth(), validate(aiValidation.aiFaqValidation), aiController.aiFaqController);

module.exports = router;
