const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const budgetSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    budget: {
      type: Number,
      required: true,
    },
    month: {
      type: Date,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    capacity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema, 'budgets');
