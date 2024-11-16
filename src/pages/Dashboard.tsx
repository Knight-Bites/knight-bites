import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { FaPlus } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import RecipeType from "../utils/RecipeType";
import DeleteRecipeModal from "../components/DeleteRecipeModal";
import getUserData from "../utils/getUserData";
import Searchbar from "../components/Searchbar";
import Alert from "react-bootstrap/Alert";
import CloseButton from "react-bootstrap/CloseButton";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

function Dashboard() {
  const [userId, setUserId] = useState<string>("");
  const [allRecipes, setAllRecipes] = useState<RecipeType[]>([]);
  const [currentRecipes, setCurrentRecipes] = useState<RecipeType[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeType[]>([]);
  const [myRecipes, setMyRecipes] = useState<RecipeType[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeType>(
    {} as RecipeType
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchCriteriaBox, setShowSearchCriteriaBox] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  async function searchRecipes(searchQuery: string): Promise<object[]> {
    const requestObject: object = { search: searchQuery };
    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/searchrecipes",
        {
          method: "POST",
          body: request,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Parse the response
      const responseObject = JSON.parse(await response.text());

      // Return the results
      return responseObject["results"] || [];
    } catch (error) {
      alert("Exception occured while searching recipes: " + error);
      return [];
    }
  }

  // Called when a user presses the search button after typing a query
  async function onSearchSubmit(searchQuery: string) {
    setSearchQuery(searchQuery);
    const results: object[] = await searchRecipes(searchQuery);
    const recipeResults: RecipeType[] = results as RecipeType[];
    setCurrentRecipes(recipeResults);
    setShowSearchCriteriaBox(true);
    return;
  }

  // Called when a user presses the Clear button in the search criteria box
  function clearSearch() {
    setCurrentRecipes(allRecipes);
    setShowSearchCriteriaBox(false);
    setSearchQuery("");
  }

  // Getting all recipes is nothing more than a search for the empty string
  async function getAllRecipes(): Promise<object[]> {
    const results: object[] = await searchRecipes("");
    return results;
  }

  async function getMyRecipes(): Promise<object[]> {
    // This shouldn't happen but just check to make sure
    if (userId === "") {
      alert("Cannot get my recipes because no user is logged in");
      return [];
    }
    const requestObject: object = { userId: userId };
    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/displayRecipes",
        {
          method: "POST",
          body: request,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Parse the response
      const responseObject = JSON.parse(await response.text());

      // Return the results
      return responseObject["recipes"] || [];
    } catch (error) {
      alert("Exception occured while getting My Recipes: " + error);
      return [];
    }
  }

  async function getFavoriteRecipes(): Promise<object[]> {
    // This shouldn't happen but just check to make sure
    if (userId === "") {
      alert("Cannot get favorite recipes because no user is logged in");
      return [];
    }
    const requestObject: object = { userId: userId };
    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/favoritesGet",
        {
          method: "POST",
          body: request,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Parse the response
      const responseObject = JSON.parse(await response.text());

      // Return the results
      return responseObject["favorites"] || [];
    } catch (error) {
      alert("Exception occured while getting favorite recipes: " + error);
      return [];
    }
  }

  // Load the user's ID on loading the page
  useEffect(() => {
    const loadUserId = (): void => {
      const userData = getUserData();
      // If no user is logged in, redirect to homepage.
      if (Object.keys(userData).length === 0) {
        navigate("/");
        return;
      }
      setUserId(userData.id);
    };
    loadUserId();
  }, []);

  // Only load recipes once the userId is loaded
  useEffect(() => {
    if (userId && isLoading) {
      const fetchAllRecipes = async () => {
        const fetchedRecipes = await getAllRecipes();
        setAllRecipes(fetchedRecipes as RecipeType[]);
        setCurrentRecipes(fetchedRecipes as RecipeType[]);
      };
      const fetchFavoriteRecipeIds = async () => {
        const fetchedRecipes = await getFavoriteRecipes();
        setFavoriteRecipes(fetchedRecipes as RecipeType[]);
      };
      const fetchMyRecipes = async () => {
        const fetchedRecipes = await getMyRecipes();
        setMyRecipes(fetchedRecipes as RecipeType[]);
      };
      fetchAllRecipes();
      fetchFavoriteRecipeIds();
      fetchMyRecipes();
      setIsLoading(false);
    }
  }, [userId, getAllRecipes, getFavoriteRecipes, getMyRecipes]);

  function setFavoriteForRecipe(recipe: RecipeType): RecipeType {
    if (isRecipeInFavorites(recipe)) {
      return { ...recipe, favorite: true };
    } else {
      return { ...recipe, favorite: false };
    }
  }

  function updateRecipes(): void {
    const updatedAllRecipes = allRecipes.map((recipe) => {
      return setFavoriteForRecipe(recipe);
    });
    const updatedCurrentRecipes = currentRecipes.map((recipe) => {
      return setFavoriteForRecipe(recipe);
    });
    setAllRecipes(updatedAllRecipes);
    setCurrentRecipes(updatedCurrentRecipes);
  }

  // Called when a user presses "Delete" in the kebab menu
  function handleInitiateDelete(recipe: RecipeType): void {
    setShowDeleteModal(true);
    setRecipeToDelete(recipe);
  }

  // Called when a user confirms delete in the delete modal
  async function doDeleteRecipe(recipeToDelete: RecipeType): Promise<void> {
    const requestObject: object = {
      _id: recipeToDelete._id,
      userId: recipeToDelete.userId,
    };

    const request: string = JSON.stringify(requestObject);
    try {
      // Send the request
      const response: Response = await fetch(
        "http://knightbites.xyz:5000/api/deleteRecipe",
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

      // Some error was returned
      if ("error" in responseObject && responseObject["error"] !== "") {
        alert(
          "Error returned from deleteRecipe API: " + responseObject["error"]
        );
        return;
        // Successful delete recipe
      } else {
        setCurrentRecipes(
          currentRecipes.filter((recipe) => recipe._id !== recipeToDelete._id)
        );
        setAllRecipes(
          allRecipes.filter((recipe) => recipe._id !== recipeToDelete._id)
        );
        setMyRecipes(
          myRecipes.filter((recipe) => recipe._id !== recipeToDelete._id)
        );
        setShowDeleteModal(false);
        return;
      }
    } catch (error) {
      alert("Exception occurred while deleting the recipe: " + error);
      return;
    }
  }

  // Called when a user closes the delete modal and cancels the delete
  function onDeleteModalClose(): void {
    setShowDeleteModal(false);
    setRecipeToDelete({} as RecipeType);
  }

  function isRecipeInFavorites(recipeInQuestion: RecipeType): boolean {
    for (const favoriteRecipe of favoriteRecipes) {
      if (favoriteRecipe._id === recipeInQuestion._id) {
        return true;
      }
    }
    return false;
  }

  async function favoriteOrUnfavorite(
    favorited: boolean,
    recipeToFavorite: RecipeType
  ): Promise<void> {
    let endpoint: string;
    if (favorited) {
      endpoint = "favoritesDelete";
    } else {
      endpoint = "favoritesAdd";
    }
    const API_URL: string = "http://knightbites.xyz:5000/api/" + endpoint;

    const requestObject: object = {
      userId: userId,
      recipeId: recipeToFavorite._id,
    };
    const request: string = JSON.stringify(requestObject);

    try {
      // Send the request
      const response: Response = await fetch(API_URL, {
        method: "POST",
        body: request,
        headers: { "Content-Type": "application/json" },
      });

      // Parse the response
      const responseObject = JSON.parse(await response.text());

      if ("success" in responseObject && responseObject["success"] !== "") {
        // If currently favorited
        if (favorited) {
          // Need to unfavorite
          setFavoriteRecipes(
            favoriteRecipes.filter(
              (recipe) => recipe._id !== recipeToFavorite._id
            )
          );
        }
        // If currently unfavorited
        else {
          // Need to favorite
          setFavoriteRecipes((favoriteRecipes) => [
            ...favoriteRecipes,
            recipeToFavorite,
          ]);
        }
        updateRecipes();
        return;
        // Some error was returned from API
      } else if ("error" in responseObject && responseObject["error"] !== "") {
        const verb: string = favorited ? "unfavorite" : "favorite";
        alert(
          "Could not " +
            verb +
            ". Error returned from " +
            endpoint +
            ": " +
            responseObject["error"]
        );
        return;
        // Other
      } else {
        alert("Error: could not parse " + endpoint + " API response.");
        return;
      }
      // Exception
    } catch (error) {
      alert("Exception occurred while modifying favorites: " + error);
      return;
    }
  }

  function getTabContent(
    recipes: RecipeType[],
    fallback_message: string
  ): JSX.Element {
    if (recipes.length === 0) {
      return (
        <div className="d-flex mx-auto p-5 align-items-center justify-content-center text-center">
          <h5>{fallback_message}</h5>
        </div>
      );
    } else {
      return (
        <>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              userId={userId}
              onDelete={handleInitiateDelete}
              isFavorited={isRecipeInFavorites(recipe)}
              favoriteOrUnfavorite={favoriteOrUnfavorite}
            />
          ))}{" "}
        </>
      );
    }
  }

  return (
    <>
      <NavBar />
      <DeleteRecipeModal
        show={showDeleteModal}
        recipe={recipeToDelete}
        onClose={onDeleteModalClose}
        doDeleteRecipe={doDeleteRecipe}
      />
      <Container className="my-3">
        <div className="d-flex">
          <h1 style={{ width: "fit-content" }}>Dashboard</h1>
          <Button
            variant="primary"
            className="m-2 ms-4 d-flex align-items-center"
            onClick={() => navigate("/addrecipe")}
          >
            <FaPlus style={{ marginRight: "5px", height: "20px" }} />
            Add Recipe
          </Button>
        </div>
        <Tab.Container defaultActiveKey="explore">
          <Nav
            justify
            variant="tabs"
            defaultActiveKey="/home"
            className="col-6 mx-auto"
          >
            <Nav.Item>
              <Nav.Link eventKey="explore">Explore</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="favorites">Favorites</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="my-recipes">My Recipes</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="mt-3">
            <Tab.Pane eventKey="explore">
              <div className="p-0 d-flex align-items-center">
                <Searchbar onSearchSubmit={onSearchSubmit} />
                <Alert
                  variant="info"
                  show={showSearchCriteriaBox}
                  className="d-flex align-items-center m-0 p-2"
                >
                  <div>
                    Showing results for <strong>{searchQuery}</strong>{" "}
                  </div>
                  <OverlayTrigger overlay={<Tooltip>Clear search</Tooltip>}>
                    <CloseButton className="ms-2" onClick={clearSearch} />
                  </OverlayTrigger>
                </Alert>
              </div>

              <Row xs={1} md={2} lg={3} className="g-4">
                {getTabContent(currentRecipes, "")}
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="favorites">
              <Row xs={1} md={2} lg={3} className="g-4">
                {getTabContent(favoriteRecipes, "No favorites to show here!")}
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="my-recipes">
              <Row xs={1} md={2} lg={3} className="g-4">
                {getTabContent(
                  myRecipes,
                  "No recipes of yours to show! To upload your first recipe, click the Add Recipe button."
                )}
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
}

export default Dashboard;
