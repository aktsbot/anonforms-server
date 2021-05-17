const { responseSchema } = require("./response.schema");

const createResponse = async (req, res, next) => {
  try {
    const { value, error } = responseSchema.validate(req.body);
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
  createResponse,
};
