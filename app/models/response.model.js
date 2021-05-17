const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid"); // uuid.v4() gives uuids

const ResponseSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuid4,
    },
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "form",
    },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId },
        answer_text: { type: String },
        answer_single_option: { type: mongoose.Schema.Types.ObjectId },
        answer_multiple_option: [{ type: mongoose.Schema.Types.ObjectId }],
      },
    ],
    response_from: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("response", ResponseSchema);
