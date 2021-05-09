const { userCreationSchema } = require("./user.schema");

const authUser = (req, res, next) => {
  try {
    const { value, error } = userCreationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    req.xop = value;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  authUser,
};
