const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
exports.registerValidation = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({
        message: "Send all required user credentials",
      });
    }

    const emailExistenceChecker = await User.findOne({ email: email });
    const usernameExistenceChecker = await User.findOne({ username: username });

    if (emailExistenceChecker) {
      console.log(
        `User with an email of ${emailExistenceChecker} already exists`
      );
      return res.status(400).send("The provided email is already registered!");
    } else if (usernameExistenceChecker) {
      console.log(
        `User with a username of ${usernameExistenceChecker} already exists`
      );
      return res
        .status(400)
        .send("The provided username is already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    req.username = username;
    req.email = email;
    req.password = hashedPassword;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.loginValidation = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Send all required user credentials",
      });
    }

    req.email = email;
    req.password = password;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.tokenVerification = async (req, res, next) => {
  
  try {
    const token = await req.cookies.accessToken;

    if (!token) {
      res.send({
        message: "You are not authenticated, please login first",
        auth: false,
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403);
      req.email = decoded.email;
      next();
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};
