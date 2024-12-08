const mongoose = require("mongoose");

const QuestionsSchema = mongoose.Schema({
  // _id: String,
  title: String,
  variants: [String],
  correct: Number,
  // required: true,
});

const Questions = mongoose.model("Questions", QuestionsSchema);

module.exports = Questions;
