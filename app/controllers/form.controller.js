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

const getForm = async (req, res, next) => {
  try {
    const form = await Form.findOne(
      {
        $or: [{ uuid: req.params.form_uri }, { uri: req.params.form_uri }],
      },
      {
        uri: 1,
        uuid: 1,
        user: 1,
        title: 1,
        description: 1,
        questions: 1,
        createdAt: 1,
      }
    );

    if (!form) {
      return next({
        isClient: true,
        is404: true,
        message: "Requested form is not found",
      });
    }

    return res.status(200).json({
      data: form,
    });
  } catch (e) {
    next(e);
  }
};

const getUserForms = async (req, res, next) => {
  try {
    // paginated list of 30 per page
    const page = req.query.page || 1;
    const limit = 30;
    const skip = page * limit - limit;

    const count = await Form.countDocuments({
      user: req.afuser._id,
    });

    const forms = await Form.find(
      {
        user: req.afuser._id,
      },
      { uuid: 1, title: 1, uri: 1, _id: 0 },
      { skip, limit }
    );

    return res.status(200).json({
      data: {
        forms,
        page,
        count,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createForm,
  getForm,
  getUserForms,
};
