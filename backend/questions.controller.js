// const chalk = require("chalk");
const Questions = require("./models/Questions");

async function addQuestion({ title, variants, correct }) {
  await Questions.create({ title, variants, correct });
}

async function getQuestions() {
  const questions = await Questions.find();

  return questions;
}

async function removeQuestion(id) {
  await Questions.deleteOne({ _id: id });
}

async function updateQuestion(questionData) {
  await Questions.updateOne(
    { _id: questionData.id },
    {
      title: questionData.title,
      variants: questionData.variants,
      correct: questionData.correct,
    }
  );
}

module.exports = {
  addQuestion,
  getQuestions,
  removeQuestion,
  updateQuestion,
};
