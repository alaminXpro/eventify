const Joi = require('joi');
const httpStatus = require('http-status').default;
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body', 'cookies']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  // Safely assign validated values without modifying read-only properties
  if (value.params) req.params = value.params;
  if (value.body) req.body = value.body;
  if (value.cookies) req.cookies = value.cookies;
  // Note: req.query is read-only in Express 4.x, so we skip it

  return next();
};

module.exports = validate;
