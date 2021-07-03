const express = require("express");
const router = express.Router();

const { checkSession } = require("../middlewares");

const responseController = require("../controllers/response.controller");
const responseValidate = require("../validations/response.validation");

router.post(
  "/:form_uuid",
  responseValidate.createResponse,
  responseController.createResponse
);
router.get("/:form_uri", checkSession, responseController.getResponses);
router.get(
  "/:form_uri/csv",
  checkSession,
  responseController.generateResponseCSV
);

module.exports = router;
