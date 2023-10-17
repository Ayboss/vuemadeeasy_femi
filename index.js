require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authrouter = require("./router/authrouter");
const userrouter = require("./router/userrouter");
const taskrouter = require("./router/taskrouter");
const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Is That not insult to me </h1>");
});

app.use("/auth", authrouter);
app.use("/user", userrouter);
app.use("/task", taskrouter);

mongoose
  .connect(
    `mongodb+srv://bamiayo90:${process.env.MONGODB_PASSWORD}@cluster0.xjoxvet.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Error");
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("connecting at port ", PORT);
});
