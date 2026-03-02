import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const BorrowDetails = () => {
    const [borrow, setBorrow] = useState(null);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBorrow = async () => {
            try {
                const res = await axios.get(`https://expence-management.onrender.com/api/borrows/${id}`);
                setBorrow(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching borrow record', err);
                setLoading(false);
            }
        };

        fetchBorrow();
    }, [id]);

    const deleteBorrow = async () => {
        if (window.confirm('Are you sure you want to delete this borrow record?')) {
            try {
                await axios.delete(`https://expence-management.onrender.com/api/borrows/${id}`);
                navigate('/borrows');
            } catch (err) {
                console.error('Error deleting borrow record', err);
            }
        }
    };

    return (
        <div>
            <h1 className="mb-4">Borrow Record Details</h1>

            {loading ? (
                <p>Loading...</p>
            ) : borrow ? (
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Borrowed from: {borrow.lender}</h5>
                        <div>
                            <Link to={`/edit-borrow/${borrow._id}`} className="btn btn-primary me-2">
                                <FaEdit /> Edit
                            </Link>
                            <Button variant="danger" onClick={deleteBorrow}>
                                <FaTrash /> Delete
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Amount:</strong> {borrow.amount.toFixed(2)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Transaction Date:</strong> {new Date(borrow.date).toLocaleDateString()}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Due Date:</strong> {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Status:</strong> {' '}
                                <Badge bg={borrow.status === 'Paid' ? 'success' : 'warning'}>
                                    {borrow.status}
                                </Badge>
                            </ListGroup.Item>
                            {borrow.notes && (
                                <ListGroup.Item>
                                    <strong>Notes:</strong>
                                    <p className="mt-2 mb-0">{borrow.notes}</p>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <strong>Created At:</strong> {new Date(borrow.createdAt).toLocaleString()}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Last Updated:</strong> {new Date(borrow.updatedAt).toLocaleString()}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                        <Link to="/borrows" className="btn btn-secondary">
                            Back to List
                        </Link>
                    </Card.Footer>
                </Card>
            ) : (
                <p>Borrow record not found</p>
            )}
        </div>
    );
};

export default BorrowDetails;
