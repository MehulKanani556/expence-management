import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditBorrow = () => {
    const [lender, setLender] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Pending');
    const [notes, setNotes] = useState('');
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchBorrow = async () => {
            try {
                const res = await axios.get(`https://expence-management.onrender.com/api/borrows/${id}`);
                const borrow = res.data;

                setLender(borrow.lender);
                setAmount(borrow.amount);
                setDate(new Date(borrow.date).toISOString().split('T')[0]);
                setDueDate(borrow.dueDate ? new Date(borrow.dueDate).toISOString().split('T')[0] : '');
                setStatus(borrow.status);
                setNotes(borrow.notes || '');

                setLoading(false);
            } catch (err) {
                console.error('Error fetching borrow record', err);
                setLoading(false);
            }
        };

        fetchBorrow();
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
            await axios.put(`https://expence-management.onrender.com/api/borrows/${id}`, {
                lender,
                amount: parseFloat(amount),
                date,
                dueDate: dueDate || null,
                status,
                notes
            });

            navigate('/borrows');
        } catch (err) {
            console.error('Error updating borrow record', err);
        }
    };

    return (
        <div>
            <h1 className="mb-4">Edit Borrow Record</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <Card>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="lender">
                                <Form.Label>Lender Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter lender name"
                                    value={lender}
                                    onChange={(e) => setLender(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a lender name.
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

                            <Form.Group className="mb-3" controlId="date">
                                <Form.Label>Transaction Date</Form.Label>
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

                            <Form.Group className="mb-3" controlId="dueDate">
                                <Form.Label>Due Date (Optional)</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="status">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
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
                                Update Borrow Record
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default EditBorrow;
