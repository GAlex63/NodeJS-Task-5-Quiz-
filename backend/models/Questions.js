const mongoose = require("mongoose");

const QuestionsSchema = mongoose.Schema({
  title: String,
  variants: [String],
  correct: Number,
  // required: true,
});

const Questions = mongoose.model("Questions", QuestionsSchema);

module.exports = Questions;
