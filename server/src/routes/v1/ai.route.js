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
