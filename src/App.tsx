import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import RegisterLoginHero from "./components/RegisterLoginHero";
import DownloadAppHero from "./components/DownloadAppHero";

function App() {
  return (
    <>
      <NavBar />
      <RegisterLoginHero />
      <DownloadAppHero />
    </>
  );
}

export default App;
