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
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>([]);
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
      const results: object[] = responseObject["results"];
      return results;
    } catch (error) {
      alert(error);
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
      const results: object[] = responseObject["recipes"] || [];

      // Return the results
      return results;
    } catch (error) {
      alert(error);
      return [];
    }
  }

  async function getFavoriteRecipeIds(): Promise<string[]> {
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
      const results: string[] = responseObject["favorites"] || [];

      // Return the results
      return results;
    } catch (error) {
      alert(error);
      return [];
    }
  }

  // Load the user's ID on loading the page
  useEffect(() => {
    const loadUserId = (): void => {
      const userData = getUserData();
      if (Object.keys(userData).length === 0 || userData["id"] === "") {
        alert("error: no user logged in");
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
        const fetchedRecipeIds = await getFavoriteRecipeIds();
        setFavoriteRecipeIds(fetchedRecipeIds);
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
  }, [userId, getAllRecipes, getFavoriteRecipeIds, getMyRecipes]);

  const updateRecipes = () => {
    const updatedAllRecipes = allRecipes.map((recipe) => {
      if (favoriteRecipeIds.includes(recipe._id)) {
        return { ...recipe, favorite: true };
      } else {
        return { ...recipe, favorite: false };
      }
    });
    const updatedCurrentRecipes = currentRecipes.map((recipe) => {
      if (favoriteRecipeIds.includes(recipe._id)) {
        return { ...recipe, favorite: true };
      } else {
        return { ...recipe, favorite: false };
      }
    });
    setAllRecipes(updatedAllRecipes);
    setCurrentRecipes(updatedCurrentRecipes);
  };

  // Called when a user presses "Delete" in the kebab menu
  function handleInitiateDelete(recipe: RecipeType): void {
    setShowDeleteModal(true);
    setRecipeToDelete(recipe);
  }

  // Called when a user confirms delete in the delete modal
  function doDeleteRecipe(recipe: RecipeType): void {
    alert("deleting recipe " + recipe.recipeName + "!");
    setShowDeleteModal(false);
    return;
  }

  // Called when a user closes the delete modal and cancels the delete
  function onDeleteModalClose(): void {
    setShowDeleteModal(false);
    setRecipeToDelete({} as RecipeType);
  }

  async function favoriteOrUnfavorite(favorited: boolean, recipeId: string) {
    let API_URL: string;

    if (favorited) {
      API_URL = "http://knightbites.xyz:5000/api/favoritesDelete";
    } else {
      API_URL = "http://knightbites.xyz:5000/api/favoritesAdd";
    }

    const requestObject: object = { userId: userId, recipeId: recipeId };
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

      if (responseObject["success"] !== "") {
        // If currently favorited
        if (favorited) {
          // Need to unfavorite
          setFavoriteRecipeIds(
            favoriteRecipeIds.filter((id) => id !== recipeId)
          );
        }
        // If currently unfavorited
        else {
          // Need to favorite
          setFavoriteRecipeIds((favoriteRecipeIds) => [
            ...favoriteRecipeIds,
            recipeId,
          ]);
          updateRecipes();
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      alert(error);
      return false;
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
                {currentRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    userId={userId}
                    onDelete={handleInitiateDelete}
                    isFavorited={favoriteRecipeIds.includes(recipe._id)}
                    favoriteOrUnfavorite={favoriteOrUnfavorite}
                  />
                ))}
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="favorites">
              <Row xs={1} md={2} lg={3} className="g-4">
                {allRecipes.map(
                  (recipe) =>
                    favoriteRecipeIds.includes(recipe._id) && (
                      <RecipeCard
                        key={recipe._id}
                        recipe={recipe}
                        userId={userId}
                        onDelete={handleInitiateDelete}
                        isFavorited={favoriteRecipeIds.includes(recipe._id)}
                        favoriteOrUnfavorite={favoriteOrUnfavorite}
                      />
                    )
                )}
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="my-recipes">
              <Row xs={1} md={2} lg={3} className="g-4">
                {myRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    userId={userId}
                    onDelete={handleInitiateDelete}
                    isFavorited={favoriteRecipeIds.includes(recipe._id)}
                    favoriteOrUnfavorite={favoriteOrUnfavorite}
                  />
                ))}
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
}

export default Dashboard;
