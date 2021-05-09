const User = require("../models/user.model");

const { sha256, sendEmail, randomCode } = require("../utils");

const authUser = async (req, res, next) => {
  try {
    const payload = {
      email_hash: sha256(req.xop.email),
    };

    // check if already present
    const user = {
      uuid: "",
    };

    let userInSystem = await User.findOne(
      {
        email_hash: payload.email_hash,
      },
      { uuid: 1 }
    );

    if (!userInSystem) {
      const newUser = new User(payload);
      userInSystem = await newUser.save();
    }

    user.uuid = userInSystem.uuid;

    // set access code and its expiry for 1 hr
    const nowDate = new Date();
    userInSystem.access_code = `AC-${randomCode(6)}`;
    userInSystem.access_code_expiry = nowDate.setHours(nowDate.getHours() + 1);

    await userInSystem.save();

    const mailPayload = {
      subject: "Authentication code for Anonforms",
      to: req.xop.email,
      text: `Your authentication code is: ${userInSystem.access_code}`,
    };
    await sendEmail(mailPayload);

    return res.status(201).json({
      data: {
        user,
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  authUser,
};
