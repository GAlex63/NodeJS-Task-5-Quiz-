const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const chalk = require("chalk");
// const path = require("path");
const Note = require("./models/Questions");
const {
  getQuestions,
  getOneQuestion,
  addQuestion,
  removeQuestion,
  updateQuestion,
} = require("./questions.controller");

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

app.get("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const oneQuestion = await getOneQuestion(id);

  res.json(oneQuestion);
});

app.post("/questions", async (req, res) => {
  const { title, variants, correct } = req.body;
  const newQuestion = await addQuestion({ title, variants, correct });
  res.json(newQuestion);
});

app.put("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const questionData = req.body;

  await updateQuestion({ id, ...questionData });
});

app.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  await removeQuestion(id);
  res.send();
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
