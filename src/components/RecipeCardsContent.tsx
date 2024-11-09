import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import cardImage from "../assets/food-stock-image.jpg";

interface Props {
  tabType: string;
}

const cardData = [
  {
    title: "Card",
    text: "This is the first card.",
    buttonText: "Learn More",
  },
  {
    title: "Card",
    text: "This is the second card.",
    buttonText: "Learn More",
  },
  {
    title: "Card",
    text: "This is the third card.",
    buttonText: "Learn More",
  },
  {
    title: "Card",
    text: "This is the fourth card.",
    buttonText: "Learn More",
  },
  {
    title: "Card",
    text: "This is the fifth card.",
    buttonText: "Learn More",
  },
];

function RecipeCardsContent(props: Props) {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {cardData.map((_, index) => (
        <Col key={index} className="d-flex justify-content-center">
          <Card style={{ width: "22rem" }}>
            <Card.Img variant="top" src={cardImage} />
            <Card.Body>
              <Card.Title>{props.tabType + " Card Title"}</Card.Title>
              <Card.Text>by Author</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>Ingredient 1</ListGroup.Item>
              <ListGroup.Item>Ingredient 2</ListGroup.Item>
              <ListGroup.Item>Ingredient 3</ListGroup.Item>
            </ListGroup>
            <Card.Body>
              <Card.Link>Favorites or Actions button</Card.Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default RecipeCardsContent;
