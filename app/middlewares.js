const User = require("./models/user.model");
const Session = require("./models/session.model");

// checks if there is a token passed along
// with the request and adds the user information
// for that token along with the request after getting the info from the
// session and user collections
const checkSession = async (req, res, next) => {
  try {
    // check if the auth header is present
    // express.js converts all header names to lowercase
    const session_token = req.headers["x-af-auth"];
    if (!session_token) {
      return next({
        isClient: true,
        message: "No session token passed",
        is403: true,
      });
    }

    // check if there is a user associated with that session
    const session = await Session.findOne(
      {
        session_token,
      },
      { user: 1, session_token_expiry: 1, session_last_used: 1 }
    );

    if (!session) {
      return next({
        isClient: true,
        message: "No session found for session token",
        is403: true,
      });
    }

    const nowDate = new Date();
    if (session.session_token_expiry < nowDate) {
      await session.remove();
      return next({
        isClient: true,
        message: "Session has expired and is now removed.",
      });
    }

    const user = await User.findById(session.user, {
      uuid: 1,
      _id: 1,
    });

    if (!user) {
      // we remove the rogue session as it has no user attached to it
      await session.remove();
      return next({
        isClient: true,
        message: "No user found for session. This session has been cleared.",
        is403: true,
      });
    }

    // update session expiry to 3 hrs later everytime a token is used.
    session.session_token_expiry = nowDate.setHours(nowDate.getHours() + 3);
    session.session_last_used = new Date();
    await session.save();

    // attach the anonform user to req, so that it can be used in
    // later middlewares
    req.afuser = user;
    req.afsession = session;

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  checkSession,
};
