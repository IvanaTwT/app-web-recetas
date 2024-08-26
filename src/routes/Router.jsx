import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import Contact from "../components/Contact";
import Layout from "./Layout";
import Recetas from "../components/recetas/Recetas";
import RecetaDetail from "../components/recetas/RecetaDetail";
import RecetaForm from "../components/recetas/RecetaForm";
import Profile from "../components/recetas/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Auth/Login";
import RecetasMias from "../components/recetas/RecetasMias"
import Users from "../components/recetas/Users";
import NotFound from "../components/NotFound";
import IngredientProvider from "../components/contexts/Ing&StepContext";

const Router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: "categories/:id",
                        element: (
                            <Recetas/>
                        ),
                    }
                ]
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/users/:id",
                element: (
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/recetas",
                children: [
                    {
                        index: true,
                        element: <Recetas />,
                    },
                    {
                        path: ":id",
                        element: (
                            <ProtectedRoute>
                                <IngredientProvider>
                                    <RecetaDetail />
                                </IngredientProvider>
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "new",
                        element: (
                            <ProtectedRoute>
                                <IngredientProvider>
                                    <RecetaForm />
                                </IngredientProvider>
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "edit/:id",
                        element: (
                            <ProtectedRoute>
                                <IngredientProvider>
                                    <RecetaForm />
                                </IngredientProvider>
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "mis-recetas",
                        element: (
                            <ProtectedRoute>
                                <RecetasMias />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "*",
                element: <NotFound></NotFound>,
            },
        ],
    },
]);

export default Router;
