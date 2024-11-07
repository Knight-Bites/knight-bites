import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import heroImage from "../assets/hero-section-image.png";

function RegisterLoginHero() {
  return (
    <Container className="my-4">
      <Row className="align-items-center p-4 pb-0 pe-lg-0 pt-lg-5 rounded-3 border shadow-lg">
        <Col lg={7} className="p-3 p-lg-5 pt-lg-3">
          <h1 className="display-4 fw-bold lh-1">
            Your one-stop shop for saving and sharing recipes.
          </h1>
          <p className="lead">New to Knight-Bites? Register to get started!</p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
            <Button
              variant="primary"
              size="lg"
              className="px-4 me-md-2 fw-bold"
              href="/signup"
            >
              Register
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              className="px-4"
              href="/login"
            >
              Login
            </Button>
          </div>
        </Col>
        <Col lg={4} className="offset-lg-1 p-0 overflow-hidden">
          <Image src={heroImage} alt="" rounded width="500" />
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterLoginHero;
