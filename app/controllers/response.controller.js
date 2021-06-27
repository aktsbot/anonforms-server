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

const getResponses = async (req, res, next) => {
  try {
    const form = await Form.findOne(
      {
        uri: req.params.form_uri,
      },
      { _id: 1, uuid: 1, user: 1, questions: 1 }
    );

    if (!form) {
      return next({
        isClient: true,
        message: "Form not found",
      });
    }

    if (!form.user.equals(req.afuser._id)) {
      return next({
        is403: true,
        isClient: true,
        message: "User not owner of form",
      });
    }

    // paginated list of 30 per page
    const page = req.query.page || 1;
    const limit = 30;
    const skip = page * limit - limit;

    const count = await Response.count({
      form: form._id,
    });

    const totalPages = Math.ceil(count / limit);

    const responses = await Response.find(
      {
        form: form._id,
      },
      {
        response_from: 1,
        uuid: 1,
        _id: 0,
        createdAt: 1,
        answers: 1,
      },
      { skip, limit, sort: { createdAt: -1 } }
    );

    let responsesJSON = JSON.parse(JSON.stringify(responses));

    if (responses.length) {
      responsesJSON = responsesJSON.map((r) => {
        let newR = { ...r };
        let answered = 0;

        for (const answer of r.answers) {
          if (
            answer.answer_text ||
            answer.answer_multiple_option ||
            answer.answer_single_option
          ) {
            answered += 1;
          }
        }
        newR.answered = answered;
        // remove answers after we're done counting them
        delete newR.answers;
        return newR;
      });
    }

    return res.status(200).json({
      data: {
        responses: responsesJSON,
        form: {
          question_count: form.questions.length,
          uuid: form.uuid,
        },
        page,
        count,
        total_pages: totalPages,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createResponse,
  getResponses,
};
