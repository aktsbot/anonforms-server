const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema(
  {
    uri: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questions: [
      {
        title: { type: String, required: true },
        question_type: {
          type: String,
          enum: ["simple_text", "large_text", "checkbox", "radio", "dropdown"],
        },
        question_options: [
          {
            title: { type: String, required: true },
          },
        ],
        is_required: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("form", FormSchema);
