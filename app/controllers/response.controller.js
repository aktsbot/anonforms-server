const { Parser } = require("json2csv");
const Response = require("../models/response.model");
const Form = require("../models/form.model");

const helpers = {
  buildCSV: ({ form, responses }) => {
    // TODO: generating a csv becomes time consuming if the forms are giant
    // and have a large number of responses
    const csvFileName = form.title.toLowerCase().replace(/ /g, "-") + ".csv";
    const csvFieldNames = ["Response from"]; // will be question titles, like what is your name?
    const csvFields = ["response_from"]; // will be _ids of answers
    const csvData = [];

    for (const question of form.questions) {
      csvFieldNames.push(question.title);
      csvFields.push(question._id.toString());
    }

    for (const response of responses) {
      const __csvData = {
        response_from: response.response_from,
      };
      for (const csvField of csvFields) {
        if (csvField !== "response_from") {
          // all others are question ids
          __csvData[csvField] = "";
        }
      }

      for (const ans of response.answers) {
        // simple_text and large_text require only getting value in answer_text
        const fq = form.questions.find((q) => q._id.equals(ans.question));
        if (
          fq.question_type === "simple_text" ||
          fq.question_type === "large_text"
        ) {
          __csvData[ans.question] = ans.answer_text;
        } else if (
          fq.question_type === "radio" ||
          fq.question_type === "dropdown"
        ) {
          // get text from _ids
          const options = fq.question_options;
          const selectedOption = options.find((o) =>
            o._id.equals(ans.answer_single_option)
          );
          __csvData[ans.question] = selectedOption.title;
        } else if (fq.question_type === "checkbox") {
          // will have multiple values
          const options = fq.question_options;
          const selectedOptions = [];
          for (const amo of ans.answer_multiple_option) {
            const selectedOption = options.find((o) => o._id.equals(amo));
            selectedOptions.push(selectedOption.title);
          }
          // XXX using a comma as a delimiter in a csv file?
          __csvData[ans.question] = selectedOptions.join(",");
        }
      }
      csvData.push(__csvData);
    }

    // TODO: this could be made better
    // [{label: 'Foo Name', value: 'name' }]
    const parserFields = [];
    for (let i = 0; i < csvFields.length; i++) {
      const field = {
        label: csvFieldNames[i],
        value: csvFields[i],
      };
      parserFields.push(field);
    }

    return {
      parserFields,
      csvData,
      csvFileName,
    };
  },
  buildJSON: ({ form, responses }) => {
    const cols = [
      {
        rowField: "response_from",
        text: "Response from",
      },
    ];
    const rows = [];

    // temp space for holding question ids
    const rowFields = [];
    for (const question of form.questions) {
      cols.push({
        rowField: question._id.toString(),
        text: question.title,
      });
      rowFields.push(question._id.toString());
    }

    for (const response of responses) {
      const row = {
        id: response._id.toString(),
        response_from: response.response_from,
      };
      // we set every question answer to '' first
      for (const field of rowFields) {
        row[field] = "";
      }

      for (const ans of response.answers) {
        // simple_text and large_text require only getting value in answer_text
        const fq = form.questions.find((q) => q._id.equals(ans.question));
        if (
          fq.question_type === "simple_text" ||
          fq.question_type === "large_text"
        ) {
          row[ans.question] = ans.answer_text;
        } else if (
          fq.question_type === "radio" ||
          fq.question_type === "dropdown"
        ) {
          // get text from _ids
          const options = fq.question_options;
          const selectedOption = options.find((o) =>
            o._id.equals(ans.answer_single_option)
          );
          row[ans.question] = selectedOption.title;
        } else if (fq.question_type === "checkbox") {
          // will have multiple values
          const options = fq.question_options;
          const selectedOptions = [];
          for (const amo of ans.answer_multiple_option) {
            const selectedOption = options.find((o) => o._id.equals(amo));
            selectedOptions.push(selectedOption.title);
          }
          row[ans.question] = selectedOptions.join(",");
        }
      }
      rows.push(row);
    }

    return {
      cols,
      rows,
    };
  },
};

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
      { _id: 1, uuid: 1, user: 1, questions: 1, title: 1 }
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

    const count = await Response.countDocuments({
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
          title: form.title,
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

const generateResponseCSV = async (req, res, next) => {
  try {
    // first we need to get the form info with form_uri
    const form = await Form.findOne(
      {
        uri: req.params.form_uri,
      },
      { _id: 1, uuid: 1, user: 1, questions: 1, title: 1 }
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

    // fetch all responses
    const responses = await Response.find(
      {
        form: form._id,
      },
      {
        uuid: 1,
        answers: 1,
        response_from: 1,
      }
    );

    if (req.params.res_type === "csv") {
      const { parserFields, csvData, csvFileName } = helpers.buildCSV({
        form,
        responses,
      });

      // https://www.npmjs.com/package/json2csv#user-content-example-3
      const json2csvParser = new Parser({
        fields: parserFields,
      });
      const csv = json2csvParser.parse(csvData);
      res.attachment(csvFileName);
      return res.status(200).send(csv);
    } else {
      // we send json
      const json = helpers.buildJSON({ form, responses });
      return res.status(200).send({
        data: {
          form: {
            uuid: form.uuid,
            title: form.title,
          },
          responses: json,
        },
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createResponse,
  getResponses,
  generateResponseCSV,
};
