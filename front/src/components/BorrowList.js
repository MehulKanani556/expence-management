import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const BorrowList = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchBorrows = async () => {
            try {
                const res = await axios.get('https://expence-management.onrender.com/api/borrows');
                setBorrows(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching borrows', err);
                setLoading(false);
            }
        };

        fetchBorrows();
    }, []);

    const deleteBorrow = async (id) => {
        if (window.confirm('Are you sure you want to delete this borrow record?')) {
            try {
                await axios.delete(`https://expence-management.onrender.com/api/borrows/${id}`);
                setBorrows(borrows.filter(borrow => borrow._id !== id));
            } catch (err) {
                console.error('Error deleting borrow record', err);
            }
        }
    };

    const filteredBorrows = borrows.filter(borrow => {
        return (
            borrow.lender.toLowerCase().includes(filter.toLowerCase()) &&
            (statusFilter === '' || borrow.status === statusFilter)
        );
    });

    return (
        <div>
            <h1 className="mb-4">Borrows List</h1>

            <div className="mb-3 d-flex justify-content-between">
                <Link to="/add-borrow">
                    <Button variant="primary">Add New Borrow Record</Button>
                </Link>

                <div className="d-flex" style={{ width: '60%' }}>
                    <Form.Select
                        className="me-2"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                    </Form.Select>

                    <InputGroup>
                        <Form.Control
                            placeholder="Search by lender..."
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
                            <th>Lender</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBorrows.length > 0 ? (
                            filteredBorrows.map(borrow => (
                                <tr key={borrow._id}>
                                    <td>{new Date(borrow.date).toLocaleDateString()}</td>
                                    <td>{borrow.lender}</td>
                                    <td>{borrow.amount.toFixed(2)}</td>
                                    <td>{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <Badge bg={borrow.status === 'Paid' ? 'success' : 'warning'}>
                                            {borrow.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Link to={`/borrow/${borrow._id}`} className="btn btn-info btn-sm me-2">
                                            <FaEye />
                                        </Link>
                                        <Link to={`/edit-borrow/${borrow._id}`} className="btn btn-primary btn-sm me-2">
                                            <FaEdit />
                                        </Link>
                                        <Button variant="danger" size="sm" onClick={() => deleteBorrow(borrow._id)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No borrow records found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default BorrowList;
