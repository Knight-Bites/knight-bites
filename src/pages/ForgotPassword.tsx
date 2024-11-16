import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import logo from "../assets/knightbites-logo.png";

function ForgotPassword() {
  const [validated, setValidated] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form: EventTarget & HTMLFormElement = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);

    const email: string = form["validationEmail"].value.trim();

    const requestObject: object = {
      email: email,
    };
    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/forgot-password",
        {
          method: "POST",
          body: request,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Parse the response
      const responseObject = JSON.parse(await response.text());

      // Some error was returned
      if ("error" in responseObject && responseObject["error"] !== "") {
        alert("error: " + responseObject["error"]);
        return;
        // Successful signup
      } else if (responseObject["success"] !== "") {
        navigate("/resetpassword", { state: { email: email } });
        return;
      }
    } catch (error) {
      alert(error);
    }
  };
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
              Not to worry, we'll send you an email with a code to help reset
              your password.
            </p>

            {/* Form */}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId="validationEmail" className="mb-3">
                <Form.Label className="text-start w-100">
                  Email address
                </Form.Label>
                <Form.Control
                  type="email"
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  placeholder="Email"
                  defaultValue=""
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Send Code
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ForgotPassword;
