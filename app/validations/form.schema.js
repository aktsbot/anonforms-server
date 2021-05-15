const Joi = require("joi");

const __optionsSchema = Joi.object({
  title: Joi.string().required(),
});

const __questionSchema = Joi.object({
  title: Joi.string().required(),
  question_type: Joi.string().valid(
    "simple_text",
    "large_text",
    "checkbox",
    "radio",
    "dropdown"
  ),
  question_options: Joi.array()
    .items(__optionsSchema)
    .when("question_type", {
      is: Joi.string().valid("checkbox", "radio", "dropdown"),
      then: Joi.required(),
    }),
  is_required: Joi.boolean(),
});

const formSchema = Joi.object({
  uri: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  questions: Joi.array().items(__questionSchema),
});

module.exports = {
  formSchema,
};
