import NavBar from "../components/NavBar";
import LoginForm from "../components/LoginForm";
import Container from "react-bootstrap/Container";

function Login() {
  return (
    <>
      <NavBar />
      <Container className="my-5">
        <LoginForm />
      </Container>
    </>
  );
}

export default Login;
