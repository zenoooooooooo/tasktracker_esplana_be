const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  confirmAuth,
} = require("../controllers/userController");
const {
  registerValidation,
  loginValidation,
  tokenVerification,
} = require("../utils/auth");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.get("", tokenVerification, confirmAuth);

module.exports = router;
