import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import RecipeType from "../utils/RecipeType";
import Dropdown from "react-bootstrap/Dropdown";

interface RecipeCardProps {
  recipe: RecipeType;
  userId: string;
  onDelete: (recipe: RecipeType) => void;
}

function RecipeCard({ recipe, userId, onDelete }: RecipeCardProps) {
  const getCardFooterContent = (recipeUserId: string) => {
    if (userId === recipeUserId) {
      return (
        <Dropdown>
          <Dropdown.Toggle variant="light" className="bg-transparent border-0">
            Options
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              eventKey="edit"
              onClick={() => alert("Editing " + recipe.recipeName)}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item eventKey="delete" onClick={() => onDelete(recipe)}>
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    } else {
      return <Card.Link>Favorite</Card.Link>;
    }
  };

  return (
    <Col key={recipe._id} className="d-flex justify-content-center">
      <Card style={{ width: "22rem" }}>
        <Card.Img variant="top" src={recipe.imageEncoding} />
        <Card.Body>
          <Card.Title>{recipe.recipeName}</Card.Title>
          <Card.Text>{"by " + recipe.userId}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          {/* Map over the first 3 ingredients */}
          {recipe.recipeIngredients.slice(0, 3).map((ingredient, index) => (
            <ListGroup.Item key={index}>{ingredient}</ListGroup.Item>
          ))}

          {/* Add missing ListGroup.Items if there are fewer than 3 ingredients
                        {[...Array(3 - recipe.recipeIngredients.length)].map(
                          (_, index) => (
                            <ListGroup.Item
                              key={`missing-${index}`}
                            ></ListGroup.Item>
                          )
                        )} */}
        </ListGroup>
        <Card.Body className="p-1 text-end">
          {getCardFooterContent(recipe.userId)}
        </Card.Body>
      </Card>
    </Col>
  );
}

export default RecipeCard;
