const { userCreationSchema, userSessionSchema } = require("./user.schema");

const authUser = (req, res, next) => {
  try {
    const { value, error } = userCreationSchema.validate(req.body);
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

const makeSession = (req, res, next) => {
  try {
    const { value, error } = userSessionSchema.validate(req.body);
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
  authUser,
  makeSession,
};
