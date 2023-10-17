const express = require("express");
const authcontroller = require("../controller/authcontroller");
const usercontroller = require("../controller/usercontroller");
const router = express.Router();

router.use(authcontroller.protect);
router.get("/", usercontroller.getme);

module.exports = router;
