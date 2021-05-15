const express = require("express");
const router = express.Router();

const { checkSession } = require("../middlewares");

const formController = require("../controllers/form.controller");
const formValidate = require("../validations/form.validation");

router.post(
  "/",
  checkSession,
  formValidate.createForm,
  formController.createForm
);

module.exports = router;
