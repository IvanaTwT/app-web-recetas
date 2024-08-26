import useFetch from "../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
import "./style.css";
import { useParams, NavLink } from "react-router-dom";
import { IngredientesContext } from "../contexts/Ing&StepContext";

export default function RecetaIngrediente() {
    // const { isAuthenticated, token } = useAuth("state");
    const { id } = useParams();
    const [ingredients, setIngredients] = useState([]);
    const { ingredientesContexto , isLoadingIngrediente}= useContext(IngredientesContext)
    
    const reciperIngredienteUrl = `${
        import.meta.env.VITE_API_BASE_URL
    }/reciperover/recipes/${id}/ingredients/`;
    

    useEffect(() => {
        if (ingredientesContexto.length > 0 ) {
            fetch(reciperIngredienteUrl)
                .then((response) => response.json())
                .then((recipeIngredient) => {
                    //quantity, measure, ingredient (integer) recipe (integer)
                    const listIngredientes = [];
                    ingredientesContexto.forEach((ingrediente) => {
                        const [ing] = recipeIngredient.results.filter(
                            (rp) => rp.ingredient === ingrediente.id
                        ); //
                        // console.log("(RI): "+ing.id)
                        if (ing) {
                            listIngredientes.push({
                                id: ingrediente.id,
                                name:
                                    ingrediente.name.charAt(0).toUpperCase() +
                                    ingrediente.name.slice(1).toLowerCase(),
                                quantity: ing.quantity,
                                measure: ing.measure,
                            });
                        }
                    });
                    setIngredients(listIngredientes);
                })
                .catch((error) =>
                    console.error("Error fetching ingredients:", error)
                );
        }
    }, [ingredientesContexto, id, ingredients]);

    if(isLoadingIngrediente) return <div>Cargando ingredientes..</div>

    return (
        <div className="column is-narrow-mobile is-narrow-tablet is-3 columna-ingredients">
            <h3 className="title is-5 has-text-centered">Ingredientes</h3>

            {ingredients.length > 0 ? (
                <ul className="">
                    {ingredients.map((ingrediente,index) => (
                        <li key={index} className="ingredient-item">
                            <strong className="">{ingrediente.name}:</strong>
                            <span className="ingredient-details">
                                {ingrediente.quantity}
                                {ingrediente.measure}
                            </span>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay ingredientes disponibles para esta receta</p>
            )}
        </div>
    );
}
