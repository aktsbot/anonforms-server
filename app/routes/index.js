const express = require("express");
const router = express.Router();

const userRoutes = require("./user.route");
const formRoutes = require("./form.route");
const responseRoutes = require("./response.route");

router.use("/user", userRoutes);
router.use("/form", formRoutes);
router.use("/response", responseRoutes);

module.exports = router;
