const express = require("express");
const router = express.Router();

const responseController = require("../controllers/response.controller");
const responseValidate = require("../validations/response.validation");

router.post(
  "/:form_uuid",
  responseValidate.createResponse,
  responseController.createResponse
);

module.exports = router;
