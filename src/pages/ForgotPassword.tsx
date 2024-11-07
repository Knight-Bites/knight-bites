import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import logo from "../assets/knightbites-logo.png";

function ForgotPassword() {
  return (
    <>
      <NavBar />
      <Container className="d-flex justify-content-center align-items-center my-5">
        <Row className="w-100" style={{ maxWidth: "500px" }}>
          <Col className="text-center">
            {/* Company Logo */}
            <Image
              src={logo}
              alt="Company Logo"
              className="mb-4"
              style={{ maxWidth: "150px" }}
            />

            {/* Page Title */}
            <h2>Forgot your password?</h2>
            <p>
              Not to worry, we'll send you an email to help reset your password.
            </p>

            {/* Form */}
            <Form>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label className="text-start w-100">
                  Email address
                </Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Send Reset Link
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ForgotPassword;
