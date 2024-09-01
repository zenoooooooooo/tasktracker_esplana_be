const express = require("express");
const router = express.Router();
const {
  create,
  showAll,
  deleteTask,
  update,
  completeTask,
} = require("../controllers/taskController");
const { tokenVerification } = require("../utils/auth");

router.post("/create", tokenVerification, create);
router.put("/update/:_id", tokenVerification, update);
router.delete("/delete/:_id", tokenVerification, deleteTask);
router.put("/complete/:_id", tokenVerification, completeTask);
router.get("", tokenVerification, showAll);

module.exports = router;
