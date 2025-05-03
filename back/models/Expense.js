const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);