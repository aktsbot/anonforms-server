const express = require("express");
const router = express.Router();

const { checkSession } = require("../middlewares");

const userController = require("../controllers/user.controller");
const userValidate = require("../validations/user.validation");

router.post("/auth", userValidate.authUser, userController.authUser);
router.post("/session", userValidate.makeSession, userController.makeSession);
router.delete(
  "/session/:session_token",
  checkSession,
  userController.deleteSession
);
router.get("/", checkSession, userController.userInfo);
router.post("/logout", checkSession, userController.clearSession);
router.delete("/account", checkSession, userController.deleteAccount);

module.exports = router;
