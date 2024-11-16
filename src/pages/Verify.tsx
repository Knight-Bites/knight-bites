import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import logo from "../assets/knightbites-logo.png";
import doLogin from "../utils/doLogin";
import Alert from "react-bootstrap/Alert";

function Verify() {
  const location = useLocation();
  const data = (location.state as { email: string; password: string }) || {};
  const email: string = data["email"] || "";

  if (email === "") {
    return <h1>Error: Could not find an email to verify</h1>;
  }

  const password: string = data["password"] || "";
  const navigate = useNavigate();
  const [validated, setValidated] = useState<boolean>(false);
  const [dangerAlertText, setDangerAlertText] = useState<string>("");
  const [showDangerAlert, setShowDangerAlert] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setShowDangerAlert(false);
    setDangerAlertText("");

    const form: EventTarget & HTMLFormElement = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);

    const code: string = form["validationCode"].value.trim();

    // Verify the code
    const codeVerificationError: string = await doVerification(code);
    if (codeVerificationError !== "") {
      setDangerAlertText(codeVerificationError);
      setShowDangerAlert(true);
      return;
    }

    // If code is correct, log the user in
    const loginSuccessful: boolean = await doLogin(email, password, navigate);
    if (loginSuccessful) {
      setShowDangerAlert(false);
      setDangerAlertText("");
      setShowSuccessAlert(true);
      return;
    } else {
      setDangerAlertText("Error: Unable to log you in.");
      setShowDangerAlert(true);
      return;
    }
  }

  // Returns "" if the action was successful, otherwise, returns the error as a string.
  async function doVerification(code: string): Promise<string> {
    const requestObject: object = {
      email: email,
      verificationCode: code,
    };

    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/verify-email",
        {
          method: "POST",
          body: request,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Parse the response
      const responseObject = JSON.parse(await response.text());

      // Some error was returned from API
      if ("error" in responseObject && responseObject["error"] !== "") {
        return responseObject["error"];
        // Successful verification
      } else if (
        "success" in responseObject &&
        responseObject["success"] !== ""
      ) {
        return "";
        // Other
      } else {
        return "Error: could not parse verify-email API response.";
      }
      // Exception
    } catch (error) {
      return "Exception occurred while verifying the code: " + error;
    }
  }

  return (
    <>
      <NavBar />
      <Container className="d-flex justify-content-center align-items-center my-5">
        <Row className="w-100" style={{ maxWidth: "600px" }}>
          <Col className="text-center">
            <Image
              src={logo}
              alt="Company Logo"
              className="mb-4"
              style={{ maxWidth: "150px" }}
            />

            <h2>Verify your account</h2>
            <p>
              To verify your account, please enter the 6-digit code sent to{" "}
              <strong>{email}</strong>.
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
              Verification successful. Redirecting to dashboard...
            </Alert>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId="validationCode" className="mb-3">
                <Form.Label className="text-start w-100">Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 123456"
                  pattern="^\d{6}$"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a 6-digit code
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Submit Code
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Verify;
