import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import logo from "../assets/knightbites-logo.png";
import Image from "react-bootstrap/Image";

function NavBar() {
  const navigate = useNavigate();

  function doLogout() {
    localStorage.removeItem("user_data");
    navigate("/");
  }

  // If there is no user logged in, returns empty string
  // If a user is logged in, returns their name (First + Last).
  function getUserName(): string {
    const userData = localStorage.getItem("user_data");
    if (userData == null) {
      return "";
    }
    const userDataObject = JSON.parse(userData);
    return userDataObject.firstName + " " + userDataObject.lastName;
  }

  function getRemainingNavBarContent() {
    const name: string = getUserName();

    if (name === "") {
      return (
        <>
          <Button variant="primary" className="ms-1 me-1" href="/signup">
            Register
          </Button>
          <Button variant="outline-primary" className="ms-1" href="/login">
            Login
          </Button>
        </>
      );
    } else {
      return (
        <NavDropdown title={name} id="dropdown">
          <NavDropdown.Item href="/dashboard">Dashboard</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={doLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      );
    }
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <Image
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          KnightBites
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          ></Nav>
          {getRemainingNavBarContent()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
