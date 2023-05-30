import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function LotteryNavbar() {
  const router = useRouter();

  const handleNavigate: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    router.push(href ?? '/');
  };

  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="/" onClick={handleNavigate}>
          LOTTERY
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" onClick={handleNavigate}>
              Lottery
            </Nav.Link>
            <Nav.Link href="/edit" onClick={handleNavigate}>
              edit
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LotteryNavbar;
