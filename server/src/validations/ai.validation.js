const Joi = require('joi');

const aiFaqValidation = {
  body: Joi.object({
    message: Joi.string().trim().max(2000).required()
  })
};

module.exports = { aiFaqValidation };
