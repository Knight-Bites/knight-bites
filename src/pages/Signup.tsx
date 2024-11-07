import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import SignupForm from "../components/SignupForm";

function Signup() {
  return (
    <>
      <NavBar />
      <Container className="my-5">
        <SignupForm />
      </Container>
    </>
  );
}

export default Signup;
