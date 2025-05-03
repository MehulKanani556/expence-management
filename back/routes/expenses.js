const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new expense
router.post('/', async (req, res) => {
  const expense = new Expense({
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    paymentMethod: req.body.paymentMethod,
    notes: req.body.notes
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (req.body.description) expense.description = req.body.description;
    if (req.body.amount) expense.amount = req.body.amount;
    if (req.body.category) expense.category = req.body.category;
    if (req.body.date) expense.date = req.body.date;
    if (req.body.paymentMethod) expense.paymentMethod = req.body.paymentMethod;
    if (req.body.notes) expense.notes = req.body.notes;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await expense.remove();
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get expenses by category
router.get('/category/:category', async (req, res) => {
  try {
    const expenses = await Expense.find({ category: req.params.category }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get expenses by date range
router.get('/date-range/:startDate/:endDate', async (req, res) => {
  try {
    const expenses = await Expense.find({
      date: {
        $gte: new Date(req.params.startDate),
        $lte: new Date(req.params.endDate)
      }
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;