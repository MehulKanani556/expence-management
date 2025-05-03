import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Expense Manager</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/expenses">
              <Nav.Link>Expenses</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/add-expense">
              <Nav.Link>Add Expense</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/reports">
              <Nav.Link>Reports</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;