import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import AddRecipe from "./pages/AddRecipe";
import Verify from "./pages/Verify";
import ResetPassword from "./pages/ResetPassword";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/addrecipe", element: <AddRecipe /> },
  { path: "/verify", element: <Verify /> },
  { path: "/resetpassword", element: <ResetPassword /> },
]);
