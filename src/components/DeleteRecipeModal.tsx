import RecipeType from "../utils/RecipeType";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface DeleteRecipeModalProps {
  show: boolean;
  recipe: RecipeType;
  onClose: () => void;
  doDeleteRecipe: (recipe: RecipeType) => void;
}

function DeleteRecipeModal({
  show,
  recipe,
  doDeleteRecipe,
  onClose,
}: DeleteRecipeModalProps) {
  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Delete Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the recipe{" "}
        <strong>{recipe.recipeName}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => doDeleteRecipe(recipe)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteRecipeModal;
