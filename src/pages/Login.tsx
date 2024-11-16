import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Alert from "react-bootstrap/Alert";
import classNames from "classnames";
import Container from "react-bootstrap/Container";
import NavBar from "../components/NavBar";
import doLogin from "../utils/doLogin";
import { useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
  password: string;
}

type Field = "email" | "password";

function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  function togglePasswordVisibility(): void {
    setShowPassword(!showPassword);
  }

  function handleBlur(field: Field): void {
    setTouched({ ...touched, [field]: true });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setShowAlert(false); // Clear alert on new input
    setFormValues({ ...formValues, [name]: value });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    const { email, password } = formValues;

    if (!email || !password) {
      setTouched({ email: true, password: true });
      return;
    }
    // Attempt to login
    const loginSuccessful: boolean = await doLogin(
      email.trim(),
      password,
      navigate
    );
    if (loginSuccessful) {
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  }

  return (
    <>
      <NavBar />
      <Container className="my-5">
        <h1 className="my-3">Log In</h1>
        <Col sm={8} md={6} lg={5} xl={4}>
          {showAlert && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setShowAlert(false)}
            >
              Incorrect email or password.
            </Alert>
          )}
        </Col>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 my-3">
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
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur("email")}
                className={classNames({
                  "is-invalid": touched.email && !formValues.email,
                })}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your email.
              </Form.Control.Feedback>
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
                  name="password"
                  placeholder="Password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("password")}
                  className={classNames({
                    "is-invalid": touched.password && !formValues.password,
                  })}
                  required
                />
                <InputGroup.Text
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                  id="inputGroupAppend"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  Please enter your password.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Button type="submit">Log In</Button>
          <div className="pt-3 d-flex align-items-center">
            <Button
              className="p-0"
              variant="link"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot password?
            </Button>
          </div>

          <div className="pt-1 d-flex align-items-center">
            <p className="m-0">Don't have an account?</p>
            <Button variant="link" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default Login;
