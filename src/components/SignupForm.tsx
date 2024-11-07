import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignupForm() {
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginExists, setLoginExists] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [secondsUntilRedirect, setSecondsUntilRedirect] = useState(3);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function sleep(seconds: number): Promise<void> {
    const ms: number = seconds * 1000;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function doSignup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<void> {
    let requestObject = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    let request = JSON.stringify(requestObject);

    try {
      const response = await fetch("http://knightbites.xyz:5000/api/register", {
        method: "POST",
        body: request,
        headers: { "Content-Type": "application/json" },
      });

      let responseObject = JSON.parse(await response.text());

      if (responseObject.error !== "") {
        // do something to handle error here
        // show alert
      } else if (responseObject.success === "User registered successfully") {
        setSignupSuccess(true);
        await sleep(1);
        setSecondsUntilRedirect(2);
        await sleep(1);
        setSecondsUntilRedirect(1);
        await sleep(1);
        setSecondsUntilRedirect(0);

        navigate("/login");
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    const firstName: string = form.validationFirstName.value.trim();
    const lastName: string = form.validationLastName.value.trim();
    const email: string = form.validationEmail.value.trim();
    const password: string = form.validationPassword.value.trim();

    doSignup(firstName, lastName, email, password);
    setValidated(true);
  };

  return (
    <>
      <h1 className="my-3">Sign Up</h1>
      <Col md="4">
        {loginExists && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setLoginExists(false)}
          >
            Login already exists.
          </Alert>
        )}
        {signupSuccess && (
          <Alert variant="success">
            Signup success. Redirecting to login in
            {secondsUntilRedirect} seconds...
          </Alert>
        )}
      </Col>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationFirstName">
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
          <Form.Group as={Col} md="4" controlId="validationLastName">
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
          <Form.Group as={Col} md="4" controlId="validationEmail">
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
          <Form.Group as={Col} md="4" controlId="validationPassword">
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
    </>
  );
}

export default SignupForm;
