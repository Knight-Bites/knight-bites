import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import RecipeCardsContent from "../components/RecipeCardsContent";
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
  const [myRecipes, setMyRecipes] = useState<RecipeType[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<RecipeType>(
    {} as RecipeType
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchCriteriaBox, setShowSearchCriteriaBox] =
    useState<boolean>(false);

  const navigate = useNavigate();

  async function getAllRecipes(): Promise<object[]> {
    const results = await searchRecipes("");
    return results;
  }

  async function getMyRecipes(): Promise<object[]> {
    if (userId === "") {
      alert("cannot get my recipes because no user is logged in");
      return [];
    }
    let requestObject = { userId: userId };
    let request = JSON.stringify(requestObject);

    try {
      const response = await fetch(
        "http://knightbites.xyz:5000/api/displayRecipes",
        {
          method: "POST",
          body: request,
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseObject = JSON.parse(await response.text());
      const results: object[] = responseObject.recipes || [];

      return results;
    } catch (error: any) {
      alert(error.toString());
      return [];
    }
  }

  useEffect(() => {
    const loadUserId = () => {
      const userData = getUserData();
      if (Object.keys(userData).length === 0 || userData.id === "") {
        alert("error: no user logged in");
        return;
      }
      setUserId(userData.id);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchAllRecipes = async () => {
        const fetchedRecipes = await getAllRecipes();
        setAllRecipes(fetchedRecipes as RecipeType[]);
        setCurrentRecipes(fetchedRecipes as RecipeType[]);
      };
      const fetchMyRecipes = async () => {
        const fetchedRecipes = await getMyRecipes();
        setMyRecipes(fetchedRecipes as RecipeType[]);
      };
      fetchAllRecipes();
      fetchMyRecipes();
    }
  }, [userId]);

  function handleInitiateDelete(recipe: RecipeType): void {
    setShowDeleteModal(true);
    setRecipeToDelete(recipe);
  }

  function doDeleteRecipe(recipe: RecipeType): void {
    alert("deleting recipe " + recipe.recipeName + "!");
    setShowDeleteModal(false);
    return;
  }

  function onDeleteModalClose() {
    setShowDeleteModal(false);
    setRecipeToDelete({} as RecipeType);
  }

  async function onSearchSubmit(searchQuery: string) {
    setSearchQuery(searchQuery);
    const results: object[] = await searchRecipes(searchQuery);
    const recipeResults = results as RecipeType[];
    setCurrentRecipes(recipeResults);
    setShowSearchCriteriaBox(true);
    return;
  }

  async function searchRecipes(searchQuery: string): Promise<object[]> {
    let requestObject = { search: searchQuery };
    let request = JSON.stringify(requestObject);

    try {
      const response = await fetch(
        "http://knightbites.xyz:5000/api/searchrecipes",
        {
          method: "POST",
          body: request,
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseObject = JSON.parse(await response.text());

      const results: object[] = responseObject.results;

      return results;
    } catch (error: any) {
      alert(error.toString());
      return [];
    }
  }

  function clearSearch() {
    setCurrentRecipes(allRecipes);
    setShowSearchCriteriaBox(false);
    setSearchQuery("");
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
                {currentRecipes.map((recipe, _) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    userId={userId}
                    onDelete={handleInitiateDelete}
                  />
                ))}
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="favorites">
              <RecipeCardsContent tabType="favorites" />
            </Tab.Pane>
            <Tab.Pane eventKey="my-recipes">
              <Row xs={1} md={2} lg={3} className="g-4">
                {myRecipes.map((recipe, _) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    userId={userId}
                    onDelete={handleInitiateDelete}
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
