import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [filteredExpenses, setFilteredExpenses] = useState([]);
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
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expenses',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  });
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('https://expence-management.onrender.com/api/expenses');
        setExpenses(res.data);
        
        // Extract unique years and months from expenses
        const years = [...new Set(res.data.map(expense => new Date(expense.date).getFullYear()))];
        const months = [...new Set(res.data.map(expense => new Date(expense.date).getMonth()))];
        setAvailableYears(years);
        setAvailableMonths(months);
        
        // Filter expenses based on selected time period
        const now = new Date();
        const filtered = res.data.filter(expense => {
          const expenseDate = new Date(expense.date);
          if (timePeriod === 'weekly') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return expenseDate >= weekAgo;
          } else if (timePeriod === 'monthly') {
            return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
          } else if (timePeriod === 'yearly') {
            return expenseDate.getFullYear() === selectedYear;
          }
          return true;
        });
        setFilteredExpenses(filtered);
        
        // Calculate total expense from filtered data
        const total = filtered.reduce((acc, expense) => acc + expense.amount, 0);
        setTotalExpense(total);
        
        // Process category data from filtered data
        const categories = {};
        filtered.forEach(expense => {
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
        
        // Process bar chart data based on selected time period
        const timeData = {};
        if (timePeriod === 'yearly') {
          // For yearly view, aggregate data by month
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          months.forEach(month => {
            timeData[month] = 0;
          });
          filtered.forEach(expense => {
            const date = new Date(expense.date);
            const month = date.toLocaleString('default', { month: 'short' });
            timeData[month] += expense.amount;
          });
        } else if (timePeriod === 'monthly') {
          // For monthly view, aggregate data by day
          const now = new Date();
          const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          for (let i = 1; i <= daysInMonth; i++) {
            timeData[i] = 0;
          }
          filtered.forEach(expense => {
            const date = new Date(expense.date);
            const day = date.getDate();
            timeData[day] += expense.amount;
          });
        } else if (timePeriod === 'weekly') {
          // For weekly view, aggregate data by day for the last 7 days
          const now = new Date();
          for (let i = 0; i < 7; i++) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const day = date.toLocaleString('default', { weekday: 'short' });
            timeData[day] = 0;
          }
          filtered.forEach(expense => {
            const date = new Date(expense.date);
            const day = date.toLocaleString('default', { weekday: 'short' });
            timeData[day] += expense.amount;
          });
        }
        
        setBarData({
          labels: Object.keys(timeData),
          datasets: [
            {
              label: `${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Expenses`,
              data: Object.values(timeData),
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
  }, [timePeriod, selectedYear, selectedMonth]);

  // Helper function to get ISO week number
  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

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
                  <h2>{totalExpense.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Number of Transactions</Card.Title>
                  <h2>{filteredExpenses.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Average Transaction</Card.Title>
                  <h2>{(totalExpense / filteredExpenses.length).toFixed(2)}</h2>
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
                  <Card.Title>Time Period Expenses</Card.Title>
                  <div className="mb-3">
                    <select 
                      value={timePeriod} 
                      onChange={(e) => setTimePeriod(e.target.value)}
                      className="form-select"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  {timePeriod === 'yearly' && (
                    <div className="mb-3">
                      <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="form-select"
                      >
                        {availableYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {timePeriod === 'monthly' && (
                    <div className="mb-3">
                      <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="form-select"
                      >
                        {availableMonths.map(month => (
                          <option key={month} value={month}>{new Date(0, month).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div style={{ height: '300px' }}>
                    <Bar 
                      data={barData} 
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