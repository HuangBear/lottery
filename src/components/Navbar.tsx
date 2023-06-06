import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'next/image';

function LotteryNavbar() {
  const router = useRouter();

  const handleNavigate: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    router.push(href ?? '/');
  };

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/" onClick={handleNavigate}>
          <Image src="/logo.png" alt="logo" width={127.75} height={80.9} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/edit" onClick={handleNavigate}>
              設定抽獎資料
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LotteryNavbar;
