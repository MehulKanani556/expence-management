import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import AddExpense from './components/AddExpense';
import EditExpense from './components/EditExpense';
import ExpenseDetails from './components/ExpenseDetails';
// import Reports from './components/Reports';

function App() {
  return (
    <>
      <Header />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/edit-expense/:id" element={<EditExpense />} />
          <Route path="/expense/:id" element={<ExpenseDetails />} />
          {/* <Route path="/reports" element={<Reports />} /> */}
        </Routes>
      </Container>
    </>
  );
}
export default App;