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
router.get("/:form_uuid", checkSession, responseController.getResponses);

module.exports = router;
