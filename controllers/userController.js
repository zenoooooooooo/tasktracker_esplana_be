require("dotenv").config();
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req;

    const newUser = {
      username: username,
      email: email,
      password: password,
    };

    const user = await User.create(newUser);
    return res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req;

    const user = await User.findOne({ email: email });

    console.log(user);
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
        sameSite: "Lax",
      });
      res
        .status(200)
        .send({ message: "Logged in successfully!", token: token });
    } else {
      console.log("Wrong password");
      res.status(400).send({ message: "Wrong login credentials!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    });
    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.confirmAuth = async (req, res) => {
  try {
    const { email } = req;
    const user = await User.findOne({ email });
    if (user) {
      console.log({ user, auth: true });
      res.status(201).send({ user, auth: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};
