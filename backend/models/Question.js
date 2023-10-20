const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionName: String,
  questionUrl: String,
  username: {
    type: String,
    ref: "Users",
    required: true,
  },
  section : String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  answers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answers",
  },
  comments: [
    {
      username: String,
      text: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});
QuestionSchema.index({ questionName: 'text' });

module.exports = mongoose.model("Questions", QuestionSchema);
