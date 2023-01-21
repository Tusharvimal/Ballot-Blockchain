import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap';

function CustomNavbar({ isManager, account }) {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">Voting Project</Navbar.Brand>
                <Nav className='me-auto' >
                    <Nav.Link >
                        {account !== undefined ? account : <></>}
                    </Nav.Link>
                </Nav>
                {
                    isManager ?
                        <Nav className="ml-auto">
                            <Nav.Link href="managerAccess" className='text-light'>Manager Access</Nav.Link>
                        </Nav>
                        : <></>
                }
            </Container>
        </Navbar>
    )
}

export default CustomNavbar