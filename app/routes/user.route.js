const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const userValidate = require("../validations/user.validation");

router.post("/auth", userValidate.authUser, userController.authUser);

module.exports = router;
