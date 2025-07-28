// frontend/src/components/ExpenseDetails.js
// Component to show detailed view of a single expense
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ExpenseDetails = () => {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`https://expence-management.onrender.com/api/expenses/${id}`);
        setExpense(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expense', err);
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [id]);

  const deleteExpense = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`https://expence-management.onrender.com/api/expenses/${id}`);
        navigate('/expenses');
      } catch (err) {
        console.error('Error deleting expense', err);
      }
    }
  };

  return (
    <div>
      <h1 className="mb-4">Expense Details</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : expense ? (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{expense.description}</h5>
            <div>
              <Link to={`/edit-expense/${expense._id}`} className="btn btn-primary me-2">
                <FaEdit /> Edit
              </Link>
              <Button variant="danger" onClick={deleteExpense}>
                <FaTrash /> Delete
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Amount:</strong> {expense.amount.toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Category:</strong> {expense.category}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}
              </ListGroup.Item>
              {expense.paymentMethod && (
                <ListGroup.Item>
                  <strong>Payment Method:</strong> {expense.paymentMethod}
                </ListGroup.Item>
              )}
              {expense.notes && (
                <ListGroup.Item>
                  <strong>Notes:</strong>
                  <p className="mt-2 mb-0">{expense.notes}</p>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <strong>Created At:</strong> {new Date(expense.createdAt).toLocaleString()}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Last Updated:</strong> {new Date(expense.updatedAt).toLocaleString()}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
          <Card.Footer>
            <Link to="/expenses" className="btn btn-secondary">
              Back to Expenses
            </Link>
          </Card.Footer>
        </Card>
      ) : (
        <p>Expense not found</p>
      )}
    </div>
  );
};

export default ExpenseDetails;