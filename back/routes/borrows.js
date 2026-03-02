const express = require('express');
const router = express.Router();
const Borrow = require('../models/Borrow');

// Get all borrows
router.get('/', async (req, res) => {
    try {
        const borrows = await Borrow.find().sort({ date: -1 });
        res.json(borrows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get borrow by ID
router.get('/:id', async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id);
        if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
        res.json(borrow);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new borrow
router.post('/', async (req, res) => {
    const borrow = new Borrow({
        lender: req.body.lender,
        amount: req.body.amount,
        date: req.body.date,
        dueDate: req.body.dueDate,
        status: req.body.status,
        notes: req.body.notes
    });

    try {
        const newBorrow = await borrow.save();
        res.status(201).json(newBorrow);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update borrow
router.put('/:id', async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id);
        if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

        if (req.body.lender) borrow.lender = req.body.lender;
        if (req.body.amount) borrow.amount = req.body.amount;
        if (req.body.date) borrow.date = req.body.date;
        if (req.body.dueDate) borrow.dueDate = req.body.dueDate;
        if (req.body.status) borrow.status = req.body.status;
        if (req.body.notes) borrow.notes = req.body.notes;

        const updatedBorrow = await borrow.save();
        res.json(updatedBorrow);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete borrow
router.delete('/:id', async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id);
        if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

        await Borrow.deleteOne({ _id: req.params.id });
        res.json({ message: 'Borrow record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
