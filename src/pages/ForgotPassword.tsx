import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
import logo from "../assets/knightbites-logo.png";

function ForgotPassword() {
  const [validated, setValidated] = useState<boolean>(false);
  const [dangerAlertText, setDangerAlertText] = useState<string>("");
  const [showDangerAlert, setShowDangerAlert] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  const navigate = useNavigate();

  async function sendCode(email: string): Promise<string> {
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

      // Some error was returned from API
      if ("error" in responseObject && responseObject["error"] !== "") {
        return (
          "Error returned from forgot-password API: " + responseObject["error"]
        );
        // Successful code send
      } else if (
        "success" in responseObject &&
        responseObject["success"] !== ""
      ) {
        return "";
      }
      // Other
      else {
        return "Error: could not parse forgot-password API response.";
      }
      // Exception
    } catch (error) {
      return "Exception occured while sending the code: " + error;
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    const form: EventTarget & HTMLFormElement = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);

    const email: string = form["validationEmail"].value.trim();

    const codeSendError: string = await sendCode(email);

    if (codeSendError !== "") {
      setDangerAlertText(codeSendError);
      setShowDangerAlert(true);
      return;
    }
    setShowSuccessAlert(true);
    navigate("/resetpassword", { state: { email: email } });
  }
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
            <Alert
              variant="danger"
              show={showDangerAlert}
              dismissible
              onClose={() => {
                setShowDangerAlert(false);
                setDangerAlertText("");
              }}
            >
              {dangerAlertText}
            </Alert>
            <Alert variant="success" show={showSuccessAlert}>
              A code has been sent to your email. Redirecting you to enter that
              code...
            </Alert>

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
