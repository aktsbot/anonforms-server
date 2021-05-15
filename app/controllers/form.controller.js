const Form = require("../models/form.model");

const createForm = async (req, res, next) => {
  try {
    return res.status(201).json({
      message: "works!",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createForm,
};
