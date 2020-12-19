const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const expenseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 24,
  },
  expense: {
    type: Number,
    required: true,
  },
  budget: {
    type: ObjectId,
    ref: "Budget",
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Expense", expenseSchema, "expenses");
