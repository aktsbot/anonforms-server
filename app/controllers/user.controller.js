const User = require("../models/user.model");

const { sha256 } = require("../utils");

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
