import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('https://expence-management.onrender.com/api/expenses');
        setExpenses(res.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(expense => expense.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expenses', err);
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);

  const deleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`https://expence-management.onrender.com/api/expenses/${id}`);
        setExpenses(expenses.filter(expense => expense._id !== id));
      } catch (err) {
        console.error('Error deleting expense', err);
      }
    }
  };

  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter(expense => {
    return (
      expense.description.toLowerCase().includes(filter.toLowerCase()) &&
      (categoryFilter === '' || expense.category === categoryFilter)
    );
  });

  return (
    <div>
      <h1 className="mb-4">Expense List</h1>
      
      <div className="mb-3 d-flex justify-content-between">
        <Link to="/add-expense">
          <Button variant="primary">Add New Expense</Button>
        </Link>
        
        <div className="d-flex" style={{ width: '60%' }}>
          <Form.Select 
            className="me-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Select>
          
          <InputGroup>
            <Form.Control
              placeholder="Search expenses..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map(expense => (
                <tr key={expense._id}>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>
                    <Link to={`/expense/${expense._id}`} className="btn btn-info btn-sm me-2">
                      <FaEye />
                    </Link>
                    <Link to={`/edit-expense/${expense._id}`} className="btn btn-primary btn-sm me-2">
                      <FaEdit />
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => deleteExpense(expense._id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No expenses found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ExpenseList;