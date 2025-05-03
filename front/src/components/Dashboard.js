import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  });
  
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Monthly Expenses',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('https://expence-management.onrender.com/api/expenses');
        setExpenses(res.data);
        
        // Calculate total expense
        const total = res.data.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalExpense(total);
        
        // Process category data
        const categories = {};
        res.data.forEach(expense => {
          if (categories[expense.category]) {
            categories[expense.category] += expense.amount;
          } else {
            categories[expense.category] = expense.amount;
          }
        });
        
        setCategoryData({
          labels: Object.keys(categories),
          datasets: [
            {
              data: Object.values(categories),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40'
              ]
            }
          ]
        });
        
        // Process monthly data
        const months = {};
        res.data.forEach(expense => {
          const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
          if (months[month]) {
            months[month] += expense.amount;
          } else {
            months[month] = expense.amount;
          }
        });
        
        setMonthlyData({
          labels: Object.keys(months),
          datasets: [
            {
              label: 'Monthly Expenses',
              data: Object.values(months),
              backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }
          ]
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expenses', err);
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total Expenses</Card.Title>
                  <h2>${totalExpense.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Number of Transactions</Card.Title>
                  <h2>{expenses.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Average Transaction</Card.Title>
                  <h2>${(totalExpense / expenses.length).toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Expenses by Category</Card.Title>
                  <div style={{ height: '300px' }}>
                    <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Monthly Expenses</Card.Title>
                  <div style={{ height: '300px' }}>
                    <Bar 
                      data={monthlyData} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }} 
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;