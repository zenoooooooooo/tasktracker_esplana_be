require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT;
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const { connectDB } = require("./utils/db");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/tasks", taskRoutes);
app.listen(PORT, () => {
  connectDB();
  console.log(`App is listening on port: ${PORT}`);
});
