const express = require("express");
const taskcontroller = require("../controller/taskcontroller");
const authcontroller = require("../controller/authcontroller");
const router = express.Router();

router.use(authcontroller.protect);
router.get("/", taskcontroller.getAllTask);
router.get("/:id", taskcontroller.getTask);
router.post("/", taskcontroller.createTask);
router.patch("/:id", taskcontroller.updateTask);
router.delete("/:id", taskcontroller.deleteTask);

module.exports = router;
