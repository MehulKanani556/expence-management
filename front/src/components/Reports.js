// frontend/src/components/Reports.js
// Component for generating and viewing expense reports
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [reportType, setReportType] = useState('summary');
  
  // Chart data states
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Expenses',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });
  
  // Summary data states
  const [summaryData, setSummaryData] = useState({
    totalExpense: 0,
    avgExpense: 0,
    maxExpense: 0,
    minExpense: 0,
    expenseCount: 0,
    categoryBreakdown: {}
  });

  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(res.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(expense => expense.category))];
        setCategories(uniqueCategories);
        
        // Set default date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        setEndDate(today.toISOString().split('T')[0]);
        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expenses', err);
        setLoading(false);
      }
    };
    
    fetchAllExpenses();
  }, []);

  useEffect(() => {
    // Generate reports when filters change
    if (expenses.length > 0 && startDate && endDate) {
      generateReport();
    }
  }, [expenses, startDate, endDate, category, reportType]);

  const generateReport = () => {
    // Filter expenses based on date range and category
    let filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the full end date
      
      return expenseDate >= start && expenseDate <= end;
    });
    
    if (category) {
      filteredExpenses = filteredExpenses.filter(expense => expense.category === category);
    }
    
    // Generate summary data
    if (filteredExpenses.length > 0) {
      const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const avg = total / filteredExpenses.length;
      const max = Math.max(...filteredExpenses.map(expense => expense.amount));
      const min = Math.min(...filteredExpenses.map(expense => expense.amount));
      
      // Category breakdown
      const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
        if (acc[expense.category]) {
          acc[expense.category] += expense.amount;
        } else {
          acc[expense.category] = expense.amount;
        }
        return acc;
      }, {});
      
      setSummaryData({
        totalExpense: total,
        avgExpense: avg,
        maxExpense: max,
        minExpense: min,
        expenseCount: filteredExpenses.length,
        categoryBreakdown
      });
      
      // Generate chart data based on report type
      if (reportType === 'daily') {
        generateDailyChart(filteredExpenses);
      } else if (reportType === 'weekly') {
        generateWeeklyChart(filteredExpenses);
      } else if (reportType === 'monthly') {
        generateMonthlyChart(filteredExpenses);
      } else if (reportType === 'category') {
        generateCategoryChart(filteredExpenses);
      }
    }
  };
  
  const generateDailyChart = (filteredExpenses) => {
    // Group expenses by day
    const dailyExpenses = {};
    
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      if (dailyExpenses[date]) {
        dailyExpenses[date] += expense.amount;
      } else {
        dailyExpenses[date] = expense.amount;
      }
    });
    
    // Sort dates
    const sortedDates = Object.keys(dailyExpenses).sort();
    
    setChartData({
      labels: sortedDates,
      datasets: [{
        label: 'Daily Expenses',
        data: sortedDates.map(date => dailyExpenses[date]),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    });
  };
  
  const generateWeeklyChart = (filteredExpenses) => {
    // Group expenses by week
    const weeklyExpenses = {};
    
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Set to Sunday
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (weeklyExpenses[weekKey]) {
        weeklyExpenses[weekKey] += expense.amount;
      } else {
        weeklyExpenses[weekKey] = expense.amount;
      }
    });
    
    // Sort weeks
    const sortedWeeks = Object.keys(weeklyExpenses).sort();
    
    setChartData({
      labels: sortedWeeks.map(week => {
        const date = new Date(week);
        return `Week of ${date.toLocaleDateString()}`;
      }),
      datasets: [{
        label: 'Weekly Expenses',
        data: sortedWeeks.map(week => weeklyExpenses[week]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    });
  };
  
  const generateMonthlyChart = (filteredExpenses) => {
    // Group expenses by month
    const monthlyExpenses = {};
    
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (monthlyExpenses[monthKey]) {
        monthlyExpenses[monthKey] += expense.amount;
      } else {
        monthlyExpenses[monthKey] = expense.amount;
      }
    });
    
    // Sort months
    const sortedMonths = Object.keys(monthlyExpenses).sort();
    
    setChartData({
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(year, monthNum - 1).toLocaleDateString('default', { month: 'long', year: 'numeric' });
      }),
      datasets: [{
        label: 'Monthly Expenses',
        data: sortedMonths.map(month => monthlyExpenses[month]),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    });
  };
  
  const generateCategoryChart = (filteredExpenses) => {
    // Group expenses by category
    const categoryExpenses = {};
    
    filteredExpenses.forEach(expense => {
      if (categoryExpenses[expense.category]) {
        categoryExpenses[expense.category] += expense.amount;
      } else {
        categoryExpenses[expense.category] = expense.amount;
      }
    });
    
    setChartData({
      labels: Object.keys(categoryExpenses),
      datasets: [{
        label: 'Expenses by Category',
        data: Object.values(categoryExpenses),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    });
  };

  const exportCSV = () => {
    // Filter expenses based on date range and category
    let filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the full end date
      
      return expenseDate >= start && expenseDate <= end;
    });
    
    if (category) {
      filteredExpenses = filteredExpenses.filter(expense => expense.category === category);
    }

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Date,Description,Category,Amount,Payment Method,Notes\n";
    
    // Add expense data
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date).toLocaleDateString();
      const description = expense.description.replace(/,/g, ' '); // Remove commas to avoid CSV issues
      const category = expense.category;
      const amount = expense.amount.toFixed(2);
      const paymentMethod = expense.paymentMethod || '';
      const notes = expense.notes ? expense.notes.replace(/,/g, ' ').replace(/\n/g, ' ') : '';
      
      csvContent += `${date},${description},${category},${amount},${paymentMethod},${notes}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expense_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="mb-4">Expense Reports</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3" controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3" controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3" controlId="reportType">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="summary">Summary</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="category">By Category</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Button variant="success" onClick={exportCSV}>
              Export to CSV
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Total Expenses</Card.Title>
                  <h2>${summaryData.totalExpense.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Average Expense</Card.Title>
                  <h2>${summaryData.avgExpense.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Number of Transactions</Card.Title>
                  <h2>{summaryData.expenseCount}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {reportType !== 'summary' && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>
                  {reportType === 'daily' && 'Daily Expense Trend'}
                  {reportType === 'weekly' && 'Weekly Expense Trend'}
                  {reportType === 'monthly' && 'Monthly Expense Trend'}
                  {reportType === 'category' && 'Expenses by Category'}
                </Card.Title>
                <div style={{ height: '400px' }}>
                  {reportType === 'category' ? (
                    <Bar
                      data={chartData}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  ) : (
                    <Line
                      data={chartData}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
          
          <Card>
            <Card.Body>
              <Card.Title>Category Breakdown</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(summaryData.categoryBreakdown).map((category, index) => {
                    const amount = summaryData.categoryBreakdown[category];
                    const percentage = (amount / summaryData.totalExpense) * 100;
                    
                    return (
                      <tr key={index}>
                        <td>{category}</td>
                        <td>${amount.toFixed(2)}</td>
                        <td>{percentage.toFixed(2)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Reports;