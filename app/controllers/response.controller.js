const Response = require("../models/response.model");
const Form = require("../models/form.model");

const createResponse = async (req, res, next) => {
  try {
    const form = await Form.findOne(
      {
        uuid: req.params.form_uuid,
      },
      { _id: 1 }
    );

    if (!form) {
      return next({
        isClient: true,
        message: "Form not found",
      });
    }

    // check if the form is already answered by this person
    const responsePresent = await Response.findOne({
      response_from: req.xop.response_from,
      form: form._id,
    });

    if (responsePresent) {
      return next({
        isClient: true,
        message: `${req.xop.response_from} has already responded to this form`,
      });
    }

    const responsePayload = {
      ...req.xop,
      form: form._id,
    };

    const newResponse = new Response(responsePayload);
    const newResponseSave = await newResponse.save();

    return res.status(201).json({
      data: {
        record: {
          uuid: newResponseSave.uuid,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createResponse,
};
