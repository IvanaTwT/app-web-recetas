import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../components/contexts/AuthContext";
import RecetaProvider from "../components/contexts/Receta&CategoryContext";
export default function Layout() {
    return (
        <AuthProvider>
            <Navbar />
                <RecetaProvider>
                    <Outlet />
                </RecetaProvider>
            <Footer />
        </AuthProvider>
    );
}
