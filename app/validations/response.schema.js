const Joi = require("joi");

const __multipleAnswerSchema = Joi.string();

const __answerSchema = Joi.object({
  question: Joi.string().required(),
  answer_text: Joi.string(),
  answer_single_option: Joi.string(),
  answer_multiple_option: Joi.array().items(__multipleAnswerSchema),
});

const responseSchema = Joi.object({
  response_from: Joi.string().required(),
  answers: Joi.array().items(__answerSchema),
});

module.exports = {
  responseSchema,
};
