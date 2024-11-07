import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import heroImage from "../assets/phone.png";
import appStoreButton from "../assets/app-store-button.png";
import playStoreButton from "../assets/play-store-button.png";

function DownloadAppHero() {
  return (
    <Container className="px-4">
      <Row className="align-items-center g-5 py-5">
        <Col xs={10} sm={8} lg={6}>
          <Image
            src={heroImage}
            className="d-block mx-lg-auto img-fluid"
            alt="Phone displaying the app"
            width="250"
            height="500"
            loading="lazy"
          />
        </Col>
        <Col lg={6}>
          <h1 className="display-5 fw-bold lh-1 mb-3">Download the App</h1>
          <p className="lead">
            Knight-Bites is now available for Android and iOS!
            <br />
            Share from Anywhere!
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <a href="#" className="d-flex align-items-center p-2">
              <Image src={appStoreButton} width="200" className="mr-2" />
            </a>
            <a href="#" className="d-flex align-items-center p-2">
              <Image src={playStoreButton} width="200" className="mr-2" />
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default DownloadAppHero;
