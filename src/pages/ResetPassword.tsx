import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/knightbites-logo.png";

function ResetPassword() {
  const location = useLocation();
  const data = (location.state as { email: string }) || {};
  const email: string = data["email"] || "";

  if (email === "") {
    return <h1>Error: Could not find an email to verify</h1>;
  }

  const [validated, setValidated] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form: EventTarget & HTMLFormElement = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);

    const code: string = form["validationCode"].value.trim();
    const password: string = form["validationPassword"].value.trim();

    const requestObject: object = {
      email: email,
      resetCode: code,
      newPassword: password,
    };

    const request: string = JSON.stringify(requestObject);
    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/reset-password",
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
        navigate("/login");
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
            <h2>Reset your Password</h2>
            <p>
              Enter the verification code sent to <strong>{email}</strong> along
              with your new password
            </p>

            {/* Form */}
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="mb-3 my-3">
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
              </Row>
              <Row className="mb-3 my-3">
                <Form.Group as={Col} controlId="validationPassword">
                  <Form.Label className="text-start w-100">Password</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      pattern="^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
                      placeholder="Password"
                      defaultValue=""
                      required
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      Password must meet the requirements.
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </InputGroup>
                  <div className="text-start w-100">
                    <Form.Text>
                      Password requirements:
                      <br />- 6-16 characters long
                      <br />- Contain at least 1 uppercase letter
                      <br />- Contain at least 1 lowercase letter
                      <br />- Contain at least 1 number
                      <br />- Contain at least 1 special character (i.e.
                      !,#,$,...)
                    </Form.Text>
                  </div>
                </Form.Group>
              </Row>
              <Button variant="primary" type="submit" className="w-100">
                Reset Password
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ResetPassword;
