const Form = require("../models/form.model");

const createForm = async (req, res, next) => {
  try {
    // check if the user provided uri is available
    const formPresent = await Form.findOne({
      uri: req.xop.uri,
    });

    if (formPresent) {
      return next({
        isClient: true,
        message: `The uri "${req.xop.uri}" is already being used by another form`,
      });
    }

    const formPayload = { ...req.xop, user: req.afuser._id };
    const newForm = Form(formPayload);
    const newFormSave = await newForm.save();

    return res.status(201).json({
      data: {
        form: {
          uuid: newFormSave.uuid,
          uri: newFormSave.uri,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createForm,
};
