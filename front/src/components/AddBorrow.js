import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LENDERS = [
    'Home',
    'Khushi',
    'Family',
    'Friends',
    'Other'
];

const AddBorrow = () => {
    const [lender, setLender] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            await axios.post('https://expence-management.onrender.com/api/borrows', {
                lender,
                amount: parseFloat(amount),
                notes
            });

            navigate('/borrows');
        } catch (err) {
            console.error('Error adding borrow record', err);
        }
    };

    return (
        <div>
            <h1 className="mb-4">Add Borrow Record</h1>

            <Card>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="lender">
                            <Form.Label>Lender Name</Form.Label>
                            <Form.Select
                                value={lender}
                                onChange={(e) => setLender(e.target.value)}
                                required
                            >
                                <option value="">Select a lender</option>
                                {LENDERS.map((l, index) => (
                                    <option key={index} value={l}>{l}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select a lender name.
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
                            Add Borrow Record
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AddBorrow;
