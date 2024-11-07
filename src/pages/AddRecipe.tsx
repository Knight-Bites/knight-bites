import { useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import NavBar from "../components/NavBar";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import CloseButton from "react-bootstrap/CloseButton";
import InputGroup from "react-bootstrap/InputGroup";
import { FaPlus } from "react-icons/fa";

function AddRecipe() {
  const [validated, setValidated] = useState(false);
  const [ingredient, setIngredient] = useState<string>("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ingredientsValid, setIngredientsValid] = useState(true);

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setIngredientsList([ingredient, ...ingredientsList]);
      setIngredient("");
      setIngredientsValid(true); // Reset validation if ingredient added
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredientsList(
      ingredientsList.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    // Check if ingredients are present
    if (form.checkValidity() && ingredientsList.length > 0) {
      setValidated(true);
      // Submit form data logic here if needed
      console.log("Form submitted successfully.");
    } else {
      setValidated(false);
      setIngredientsValid(ingredientsList.length > 0); // Update ingredient validation state
    }
  };

  return (
    <>
      <NavBar />
      <Container className="my-3 col-md-4">
        <h1>Add Recipe</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3 col-md-8">
            <Form.Group as={Col} controlId="validationTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Chicken alfredo"
                defaultValue=""
              />
              <Form.Control.Feedback type="invalid">
                No title entered
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3 col-md-8">
            <Form.Group as={Col} controlId="validationImage">
              <Form.Label>Image</Form.Label>
              <Form.Control required type="file" accept="image/*" />
              <Form.Control.Feedback type="invalid">
                No image selected
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Label>Ingredients</Form.Label>
          <ListGroup>
            {ingredientsList.map((ing, index) => (
              <ListGroup.Item
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="col-md-6 d-flex justify-content-between align-items-center"
              >
                {ing}
                {hoveredIndex === index && (
                  <CloseButton onClick={() => handleRemoveIngredient(index)} />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Display validation message if no ingredients added */}
          {!ingredientsValid && (
            <div className="text-danger mt-2">
              Please add at least one ingredient.
            </div>
          )}

          {/* Ingredient input field with no validation */}
          <div className="mt-3 col-md-6">
            <InputGroup>
              <Form.Control
                type="text"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                placeholder="Enter an ingredient"
              />
              <Button
                variant="primary"
                className="ms-1 d-flex align-items-center"
                onClick={handleAddIngredient}
              >
                <FaPlus />
              </Button>
            </InputGroup>
          </div>

          <Button type="submit" className="my-4">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default AddRecipe;
