const express = require("express");
const router = express.Router();

const userRoutes = require("./user.route");
const formRoutes = require("./form.route");

router.use("/user", userRoutes);
router.use("/form", formRoutes);

module.exports = router;
