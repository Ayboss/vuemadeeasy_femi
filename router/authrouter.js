const { Router } = require("express");
const authcontroller = require("../controller/authcontroller");
const router = Router();

router.post("/login", authcontroller.login);
router.post("/signup", authcontroller.signup);

module.exports = router;
