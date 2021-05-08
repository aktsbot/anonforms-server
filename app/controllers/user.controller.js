const User = require('../models/user.model');

const createUser = async (req, res, next) => {
  try {
    return res.status(201).json({
      data: {}
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  createUser
};

