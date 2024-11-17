// const chalk = require("chalk");
const Questions = require("./models/Questions");

async function addQuestion(title) {
  await Question.create({ title });
  console.log(chalk.bgGreen("Question was added!"));
}

async function getQuestions() {
  const questions = await Questions.find();

  return questions;
}

async function removeQuestion(id) {
  await Question.deleteOne({ _id: id });
  console.log(
    chalk.foregroundColorNames(`Question with id='${id}' has been removed`)
  );
}

async function updateQuestion(questionData) {
  await Question.updateOne(
    { _id: questionData.id },
    { title: questionData.title }
  );
  console.log(
    chalk.backgroundColorNames(`Question with id='${id}' has been edited`)
  );
}

module.exports = {
  addQuestion,
  getQuestions,
  removeQuestion,
  updateQuestion,
};
