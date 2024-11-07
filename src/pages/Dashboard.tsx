import NavBar from "../components/NavBar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import RecipeCardsContent from "../components/RecipeCardsContent";
import { FaPlus } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
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
              <p>Content for Explore tab</p>
              <RecipeCardsContent tabType="explore" />
            </Tab.Pane>
            <Tab.Pane eventKey="favorites">
              <p>Content for Favorites tab</p>
              <RecipeCardsContent tabType="favorites" />
            </Tab.Pane>
            <Tab.Pane eventKey="my-recipes">
              <p>Content for My Recipes tab</p>
              <RecipeCardsContent tabType="my-recipes" />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
}

export default Dashboard;
