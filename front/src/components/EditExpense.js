import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Personal Care',
  'Education',
  'Travel',
  'Gifts & Donations',
  'Other'
];

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Mobile Payment',
  'Check',
  'Other'
];

const EditExpense = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`https://expence-management.onrender.com/api/expenses/${id}`);
        const expense = res.data;
        
        setDescription(expense.description);
        setAmount(expense.amount);
        setCategory(expense.category);
        setDate(new Date(expense.date).toISOString().split('T')[0]);
        setPaymentMethod(expense.paymentMethod || '');
        setNotes(expense.notes || '');
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expense', err);
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    try {
      await axios.put(`https://expence-management.onrender.com/api/expenses/${id}`, {
        description,
        amount: parseFloat(amount),
        category,
        date,
        paymentMethod,
        notes
      });
      
      navigate('/expenses');
    } catch (err) {
      console.error('Error updating expense', err);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Edit Expense</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Card>
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter expense description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a description.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid amount.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a category.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a date.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="paymentMethod">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select a payment method</option>
                  {PAYMENT_METHODS.map((method, index) => (
                    <option key={index} value={method}>{method}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="notes">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add any additional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Update Expense
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default EditExpense;