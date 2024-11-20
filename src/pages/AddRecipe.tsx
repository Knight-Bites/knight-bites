import { useState, useRef, useEffect } from "react";
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
import getCroppedImg from "../utils/cropImage";
import getResizedImg from "../utils/resizeImage";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import getUserData from "../utils/getUserData";
import ImageCropModal from "../components/ImageCropModal";
import { Area } from "react-easy-crop";
import Alert from "react-bootstrap/Alert";

function AddRecipe() {
  const [validated, setValidated] = useState<boolean>(false);
  const [ingredient, setIngredient] = useState<string>("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ingredientsValid, setIngredientsValid] = useState<boolean>(true);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [dangerAlertText, setDangerAlertText] = useState<string>("");
  const [showDangerAlert, setShowDangerAlert] = useState<boolean>(false);

  const navigate = useNavigate();

  // If a user tries to visit this page and is not logged in, redirect them to home page
  useEffect(() => {
    const userData = getUserData();
    if (Object.keys(userData).length === 0) {
      navigate("/");
    }
  }, [navigate]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage: File = e.target.files[0];
      setImageURL(URL.createObjectURL(selectedImage));
      setShowCropModal(true);
    }
  }

  // Called when a user chooses to close the crop modal and cancels the crop and image upload
  function handleCropCancel(): void {
    setShowCropModal(false);
    removeFile();
  }

  function removeFile(): void {
    setImageURL(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleAddIngredient(): void {
    if (ingredient.trim()) {
      setIngredientsList([...ingredientsList, ingredient.trim()]);
      setIngredient("");
      setIngredientsValid(true); // Reset validation if ingredient added
    }
  }

  function handleRemoveIngredient(indexToRemove: number): void {
    setIngredientsList(
      ingredientsList.filter((_, index) => index !== indexToRemove)
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    // form handles the Title and Image fields
    const form: EventTarget & HTMLFormElement = event.currentTarget;

    let valid: boolean = true; // Reflects the validity of both (title and image) and ingredients

    // Check to see if title and image are not empty
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      valid = false;
    }
    setValidated(true); // Reflect that we have performed validation on the title and image, even if invalid
    // Check to see if the ingredients are valid (there is at least 1)
    if (ingredientsList.length < 1) {
      event.preventDefault();
      event.stopPropagation();
      setIngredientsValid(false);
      valid = false;
    } else {
      setIngredientsValid(true);
    }
    // If all parts of form are valid
    if (valid) {
      event.preventDefault();
      event.stopPropagation();
      // Submit the add recipe
      const title: string = (
        form.elements.namedItem("validationTitle") as HTMLInputElement
      ).value;
      doAddRecipe(title);
    }
  }

  // Called when the user presses Save Crop in the crop modal
  async function onCrop(croppedAreaPixels: Area): Promise<void> {
    const croppedImageURL_: string = await getCroppedImg(
      imageURL || "default",
      croppedAreaPixels
    );
    setCroppedImageURL(croppedImageURL_);
    setShowCropModal(false);
  }

  // Called when the user submits the Add Recipe form with valid input
  async function doAddRecipe(title: string): Promise<void> {
    // Get the user's ID
    const userData = getUserData();
    // This error shouldnt happen but just check to make sure
    if (Object.keys(userData).length === 0) {
      alert("error: no user logged in");
      return;
    }
    const userId: string = userData["id"];
    const fullName: string = userData["firstName"] + " " + userData["lastName"];
    // Get the encoding of the cropped image
    const imageEncoding: string = await getResizedImg(croppedImageURL || "");
    if (imageEncoding === "" || imageEncoding == null) {
      setDangerAlertText("Error: cropped image URL is empty or null");
      setShowDangerAlert(true);
      return;
    }

    const requestObject: object = {
      userId: userId,
      fullName: fullName,
      recipeName: title,
      recipeIngredients: ingredientsList,
      imageEncoding: imageEncoding,
    };

    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/addrecipe",
        {
          method: "POST",
          body: request,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Parse the response
      const responseObject = JSON.parse(await response.text());

      // Some error was returned from API
      if ("error" in responseObject && responseObject["error"] !== "") {
        setDangerAlertText(responseObject["error"]);
        setShowDangerAlert(true);
        return;
        // Successful add recipe
      } else if (
        "success" in responseObject &&
        responseObject["success"] !== ""
      ) {
        setShowDangerAlert(false);
        setDangerAlertText("");
        setShowSuccessAlert(true);
        // Reset most states
        setValidated(false);
        setIngredient("");
        setIngredientsList([]);
        setHoveredIndex(null);
        setIngredientsValid(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (titleInputRef.current) titleInputRef.current.value = "";
        setImageURL(undefined);
        setCroppedImageURL(null);
        return;
      } else {
        setDangerAlertText("Error: could not parse addrecipe API response.");
        setShowDangerAlert(true);
      }
    } catch (error) {
      setDangerAlertText("Exception occurred while adding recipe: " + error);
      setShowDangerAlert(true);
      return;
    }
  }

  return (
    <>
      <NavBar />
      <Container className="my-3 col-md-5 col-lg-4 col-xl-3">
        <Button
          variant="link"
          className="ps-0 d-flex align-items-center"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft style={{ marginRight: "5px", height: "20px" }} />
          back to Dashboard
        </Button>
        <h1>Add Recipe</h1>
        <ImageCropModal
          showCropModal={showCropModal}
          imageURL={imageURL || ""}
          handleCropCancel={handleCropCancel}
          onCrop={onCrop}
        />
        <Alert
          variant="success"
          dismissible
          show={showSuccessAlert}
          onClose={() => setShowSuccessAlert(false)}
        >
          Recipe added successfully!
        </Alert>
        <Alert
          variant="danger"
          dismissible
          show={showDangerAlert}
          onClose={() => {
            setShowDangerAlert(false);
            setDangerAlertText("");
          }}
        >
          {dangerAlertText}
        </Alert>
        <Form
          id="titleImageForm"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter a title"
                defaultValue=""
                ref={titleInputRef}
              />
              <Form.Control.Feedback type="invalid">
                No title entered
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                required
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
              <Form.Control.Feedback type="invalid">
                No image selected
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
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
        <div className="mt-3">
          <InputGroup>
            <Form.Control
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Enter an ingredient"
              required={false}
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

        <Button form="titleImageForm" type="submit" className="my-4">
          Submit
        </Button>
      </Container>
    </>
  );
}

export default AddRecipe;
