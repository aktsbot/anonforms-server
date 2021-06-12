const User = require("../models/user.model");
const Session = require("../models/session.model");

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
    userInSystem.auth_code = `AC-${randomCode(6)}`;
    userInSystem.auth_code_expiry = nowDate.setHours(nowDate.getHours() + 1);

    await userInSystem.save();

    const mailPayload = {
      subject: "Authentication code for Anonforms",
      to: req.xop.email,
      text: `Your authentication code is: ${userInSystem.auth_code}`,
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

const makeSession = async (req, res, next) => {
  try {
    // check if the credentials match
    const email_hash = sha256(req.xop.email);
    const user = await User.findOne(
      {
        email_hash,
        auth_code: req.xop.auth_code,
      },
      { auth_code_expiry: 1, uuid: 1 }
    );

    if (!user) {
      return next({
        isClient: true,
        message: `No user found for ${req.xop.email} and ${req.xop.auth_code}`,
      });
    }

    // check for expiry
    const now = new Date();
    if (user.auth_code_expiry < now) {
      return next({
        isClient: true,
        message: `Provided authentication code has expired.`,
      });
    }

    // clear auth codes
    user.auth_code = "";
    user.auth_code_expiry = null;
    await user.save();

    // we create a session in session collection with the user
    // the session token expires after 3 hrs
    const nowDate = new Date();
    const session_token_expiry = nowDate.setHours(nowDate.getHours() + 3);
    const newSession = new Session({
      user: user._id,
      session_token_expiry,
    });

    const session = await newSession.save();

    return res.status(201).json({
      data: {
        token: session.session_token,
        user: user.uuid,
      },
    });
  } catch (e) {
    next(e);
  }
};

const userInfo = async (req, res, next) => {
  try {
    return res.status(200).json({
      data: {
        user: req.afuser.uuid,
      },
    });
  } catch (e) {
    next(e);
  }
};

const clearSession = async (req, res, next) => {
  try {
    await req.afsession.remove();
    return res.status(200).json({
      message: "Logout successful. Session has been cleared",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  authUser,
  makeSession,
  userInfo,
  clearSession,
};
