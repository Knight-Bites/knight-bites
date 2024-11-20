import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import logo from "../assets/knightbites-logo.png";
import Image from "react-bootstrap/Image";
import getUserData from "../utils/getUserData";

function NavBar() {
  const navigate = useNavigate();

  // Log out by deleting the user's data from local storage then navigating to home page
  function doLogout(): void {
    localStorage.removeItem("user_data");
    navigate("/");
  }

  // If there is no user logged in, returns empty string
  // If a user is logged in, returns their name (First + Last).
  function getUserName(): string {
    const userData = getUserData();
    if (Object.keys(userData).length === 0) {
      return "";
    }
    return userData["firstName"] + " " + userData["lastName"];
  }

  // If a user is logged in, returns a Dropdown with their name and options for Dashboard and Logout.
  // If no user is logged in, returns Register and Login buttons.
  function getRemainingNavBarContent() {
    const name: string = getUserName();

    if (name === "") {
      return (
        <>
          <Button variant="primary" className="ms-1 me-1" href="/signup">
            Sign Up
          </Button>
          <Button variant="outline-primary" className="ms-1" href="/login">
            Log In
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
            alt="knightbites-logo"
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
