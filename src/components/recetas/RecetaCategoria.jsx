import useFetch from "../hooks/useFetch";
import { useEffect, useState, useContext } from "react";
// import { useAuth } from "../contexts/AuthContext";
import "./style.css";
import { useParams, NavLink } from "react-router-dom";
import { RecetaContext } from "../contexts/Receta&CategoryContext";
import { useAuth } from "../contexts/AuthContext";

export default function RecetaCategoria() {
    // const { isAuthenticated, token } = useAuth("state");
    const { id } = useParams();//id de receta
    const { isAuthenticated, token } = useAuth("state")
    const [misCategorias, setMisCategorias] = useState([]);
    
    const {categories}= useContext(RecetaContext) 

    const recipeCategoriesUrl = `${
        import.meta.env.VITE_API_BASE_URL
    }/reciperover/recipes/${id}/categories`;


    useEffect(() => {
        if (categories) {
            fetch(recipeCategoriesUrl)
                .then((response) => response.json())
                .then((recipeCategories) => {
                    // console.log("Recipe Categories: ", recipeCategories.results); //lista
                    const listCat = [];
                    categories.forEach((category) => {
                        const [cat] = recipeCategories.results.filter(
                            (rp) => category.id === rp.category
                        ); //devuelve lista
                        if (cat) {
                            listCat.push({
                                id: category.id,
                                name: category.name,
                            });
                        }
                    });
                    //console.log("Filtered Categories: ", listCat);//categorias de esta receta
                    setMisCategorias(listCat);
                })
                .catch((error) =>
                    console.error("Error fetching categories:", error)
                );
        }
    }, [categories, id, misCategorias]);

    return (
        <div className="column">
            <div className="tags">
                {misCategorias.length > 0 ? (
                    misCategorias.map((category) => (
                        !isAuthenticated ? <NavLink
                            to={`/categories/${category.id}`}
                            key={category.id}
                            className="tag is-link"
                        >
                            #{category.name}
                        </NavLink>
                        : 
                        //eliminar categoria (do modal)
                        <NavLink
                            to={`/`}
                            key={category.id}
                            className="tag is-link"
                        >
                            #{category.name}
                        </NavLink>
                        
                    ))
                ) : (
                    <p>Sin especificar</p>
                )}
            </div>
        </div>
    );
}
