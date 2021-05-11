const Joi = require("joi");

const userCreationSchema = Joi.object({
  email: Joi.string().email().required(),
});

const userSessionSchema = Joi.object({
  email: Joi.string().email().required(),
  auth_code: Joi.string().min(9).max(9).required(),
});

module.exports = {
  userCreationSchema,
  userSessionSchema,
};
