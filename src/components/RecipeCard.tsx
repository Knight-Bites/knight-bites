import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import RecipeType from "../utils/RecipeType";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import Button from "react-bootstrap/Button";

interface RecipeCardProps {
  recipe: RecipeType;
  userId: string;
  onDelete: (recipe: RecipeType) => void;
  isFavorited: boolean;
  favoriteOrUnfavorite: (
    favorited: boolean,
    recipe: RecipeType
  ) => Promise<boolean>;
}

function RecipeCard({
  recipe,
  userId,
  onDelete,
  isFavorited,
  favoriteOrUnfavorite,
}: RecipeCardProps) {
  const getAuthor = (): string => {
    if (userId === recipe.userId) {
      return "You";
    }
    return recipe.userId;
  };
  const getSeeMoreIngredients = (): JSX.Element => {
    if (recipe.recipeIngredients.length > 3) {
      return (
        <DropdownButton
          variant="link"
          title="See more ingredients"
          drop={"end"}
        >
          {recipe.recipeIngredients.slice(3).map((ingredient, index) => (
            <Dropdown.ItemText key={index}>{ingredient}</Dropdown.ItemText>
          ))}
        </DropdownButton>
      );
    }
    return <></>;
  };
  const getCardFooterContent = (recipeUserId: string): JSX.Element => {
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
      return (
        <Button
          variant="light"
          className="bg-transparent border-0"
          onClick={onFavoriteOrUnfavorite}
        >
          {isFavorited ? (
            <MdOutlineStar size="25px" />
          ) : (
            <MdOutlineStarBorder size="25px" />
          )}
        </Button>
      );
    }
  };

  const onFavoriteOrUnfavorite = async () => {
    if (await favoriteOrUnfavorite(isFavorited, recipe)) {
      console.log("favorited successfully");
    }
  };

  return (
    <Col key={recipe._id} className="d-flex justify-content-center">
      <Card style={{ width: "22rem" }}>
        <Card.Img variant="top" src={recipe.imageEncoding} />
        <Card.Body>
          <Card.Title>{recipe.recipeName}</Card.Title>
          <Card.Text>{"by " + getAuthor()}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          {/* Map over the first 3 ingredients */}
          {recipe.recipeIngredients.slice(0, 3).map((ingredient, index) => (
            <ListGroup.Item key={index}>{ingredient}</ListGroup.Item>
          ))}

          {recipe.recipeIngredients.length < 3 &&
            [...Array(3 - recipe.recipeIngredients.length)].map((_, index) => (
              <ListGroup.Item key={`missing-${index}`}>&nbsp;</ListGroup.Item>
            ))}
        </ListGroup>
        <Card.Body className="d-flex p-1 justify-content-between">
          <div className="me-auto">{getSeeMoreIngredients()}</div>
          <div>{getCardFooterContent(recipe.userId)}</div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default RecipeCard;
