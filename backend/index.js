const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const chalk = require("chalk");
// const path = require("path");
// const Note = require("./models/Questions");
const { getQuestions } = require("./questions.controller");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/questions", async (req, res) => {
  const questions = await getQuestions();
  res.json(questions);
  // res.render("index", {
  //   title: "Express App",
  //   questions: getQuestions(),
  // });
});

mongoose
  .connect(
    "mongodb+srv://galex163:qwerty12345@cluster0.bsgru.mongodb.net/questions?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server has been started ... on port ${port}`);
    });
  });
