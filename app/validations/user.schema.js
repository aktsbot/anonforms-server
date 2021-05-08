const Joi = require('joi');

const userCreationSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  userCreationSchema
}
