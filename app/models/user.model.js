const mongoose = require("mongoose");
const { v4: uuid4 } = require("uuid"); // uuid.v4() gives uuids

const UserSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuid4,
    },
    email_hash: {
      type: String,
      required: true,
    },
    auth_code: {
      type: String,
    },
    auth_code_expiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("user", UserSchema);
