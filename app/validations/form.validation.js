const { formSchema } = require("./form.schema");

const createForm = (req, res, next) => {
  try {
    const { value, error } = formSchema.validate(req.body);
    if (error) {
      return next({
        isClient: true,
        message: error.message,
        error,
      });
    }
    req.xop = value;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createForm,
};
