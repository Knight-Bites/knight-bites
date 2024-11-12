import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";

function Signup() {
  const [validated, setValidated] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginExists, setLoginExists] = useState<boolean>(false);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  async function doSignup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> {
    const requestObject: object = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/register",
        {
          method: "POST",
          body: request,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Parse the response
      const responseObject = JSON.parse(await response.text());

      // Some error was returned
      if (responseObject["error"] !== "") {
        alert("error: " + responseObject["error"]);
        // Successful signup
      } else if (responseObject["success"] !== "") {
        setSignupSuccess(true);
        // Redirect to verify
        navigate("/verify", { state: { email: email, password: password } });
        return;
      }
    } catch (error) {
      alert(error);
      return;
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form: EventTarget & HTMLFormElement = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const firstName: string = form["validationFirstName"].value.trim();
    const lastName: string = form["validationLastName"].value.trim();
    const email: string = form["validationEmail"].value.trim();
    const password: string = form["validationPassword"].value.trim();

    doSignup(firstName, lastName, email, password);
    setValidated(true);
  };

  return (
    <>
      <NavBar />
      <Container className="my-5">
        <h1 className="my-3">Sign Up</h1>
        <Col sm={8} md={6} lg={5} xl={4}>
          <Alert
            variant="danger"
            show={loginExists}
            dismissible
            onClose={() => setLoginExists(false)}
          >
            Login already exists.
          </Alert>
          <Alert show={signupSuccess} variant="success">
            <div>Signup success. Redirecting to verification...</div>
          </Alert>
        </Col>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              sm={8}
              md={6}
              lg={5}
              xl={4}
              controlId="validationFirstName"
            >
              <Form.Label>First name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="First name"
                defaultValue=""
              />
              <Form.Control.Feedback type="invalid">
                Please enter your first name.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group
              as={Col}
              sm={8}
              md={6}
              lg={5}
              xl={4}
              controlId="validationLastName"
            >
              <Form.Label>Last name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Last name"
                defaultValue=""
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group
              as={Col}
              sm={8}
              md={6}
              lg={5}
              xl={4}
              controlId="validationEmail"
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                placeholder="Email"
                defaultValue=""
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group
              as={Col}
              sm={8}
              md={6}
              lg={5}
              xl={4}
              controlId="validationPassword"
            >
              <Form.Label>Password</Form.Label>
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
              <Form.Text>
                Password requirements:
                <br />- 6-16 characters long
                <br />- Contain at least 1 uppercase letter
                <br />- Contain at least 1 lowercase letter
                <br />- Contain at least 1 number
                <br />- Contain at least 1 special character (i.e. !,#,$,...)
              </Form.Text>
            </Form.Group>
          </Row>

          <Button type="submit">Sign Up</Button>
        </Form>
      </Container>
    </>
  );
}

export default Signup;
