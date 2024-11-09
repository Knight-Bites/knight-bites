import React, { useState, useRef } from "react";
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
import Modal from "react-bootstrap/Modal";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import getResizedImg from "../utils/resizeImage";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function AddRecipe() {
  const [validated, setValidated] = useState(false);
  const [ingredient, setIngredient] = useState<string>("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ingredientsValid, setIngredientsValid] = useState(true);
  const [showCropModal, setShowCropModal] = useState(false);
  //const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null);

  const zoomInit: number = 1;
  const cropInit = { x: 0, y: 0 };

  const [zoom, setZoom] = useState(zoomInit);
  const [crop, setCrop] = useState(cropInit);
  const aspectRatio = 3 / 2; // Fixed aspect ratio of 3:2
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      //setImage(selectedImage);
      setImageURL(URL.createObjectURL(selectedImage));
      setShowCropModal(true);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    removeFile();
  };

  const removeFile = () => {
    //setImage(null);
    setImageURL(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setZoom(zoomInit);
    setCrop(cropInit);
  };

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
    const form = event.currentTarget;

    let valid = true;

    if (form.checkValidity() === false) {
      console.log("form not valid");
      event.preventDefault();
      event.stopPropagation();
      valid = false;
    }
    setValidated(true);
    if (ingredientsList.length < 1) {
      console.log("not enough ingredients");
      event.preventDefault();
      event.stopPropagation();
      setIngredientsValid(false);
      valid = false;
    } else {
      setIngredientsValid(true);
    }

    if (valid) {
      const title: string = (
        form.elements.namedItem("validationTitle") as HTMLInputElement
      ).value;
      doAddRecipe(title);
      console.log("form submitted successfully");
    }
  };

  const onCropChange = (newCrop: any) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: any) => {
    setZoom(newZoom);
  };

  const onCropComplete = (croppedArea: any, newCroppedAreaPixels: any) => {
    croppedArea = croppedArea;
    setCroppedAreaPixels(newCroppedAreaPixels);
  };

  const onCrop = async () => {
    const croppedImageURL_ = await getCroppedImg(
      imageURL || "default",
      croppedAreaPixels
    );
    setCroppedImageURL(croppedImageURL_);
    setShowCropModal(false);
  };

  async function doAddRecipe(title: string): Promise<void> {
    const userData = localStorage.getItem("user_data");
    if (userData == null) {
      alert("No user data. Cannot add contact");
      return;
    }
    const userDataObject = JSON.parse(userData);
    const userId: string = userDataObject.id;
    console.log(croppedImageURL);
    const imageEncoding: string = await getResizedImg(croppedImageURL || "");
    if (imageEncoding === "" || imageEncoding == null) {
      alert('Major error with cropped image URL being ""');
      return;
    }

    let requestObject = {
      userId: userId,
      recipeName: title,
      recipeIngredients: ingredientsList,
      imageEncoding: imageEncoding
    };

    let request = JSON.stringify(requestObject);

    console.log(request);

    try {
      const response = await fetch(
        "http://knightbites.xyz:5000/api/addrecipe",
        {
          method: "POST",
          body: request,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      let responseObject = JSON.parse(await response.text());

      if (responseObject.error !== "") {
        alert("Response error:" + responseObject.error);
        return;
      } else {
        alert("Recipe added successfully");
        return;
      }
    } catch (error: any) {
      alert("Exception in doAddRecipe: " + error.toString());
      return;
    }
  }

  return (
    <>
      <NavBar />
      <Container className="my-3 col-md-4">
        <Button
          variant="link"
          className="ps-0 d-flex align-items-center"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft style={{ marginRight: "5px", height: "20px" }} />
          back to Dashboard
        </Button>
        <h1>Add Recipe</h1>
        <Modal show={showCropModal} dialogClassName="modal-90w">
          <Modal.Header>
            <Modal.Title>Crop Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ height: "500px" }}>
              <Cropper
                image={imageURL}
                zoom={zoom}
                crop={crop}
                aspect={aspectRatio}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCropCancel}>
              Cancel
            </Button>
            <Button variant="success" onClick={onCrop}>
              Save Crop
            </Button>
          </Modal.Footer>
        </Modal>
        <Form
          id="titleImageForm"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
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
        <div className="mt-3 col-md-6">
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
