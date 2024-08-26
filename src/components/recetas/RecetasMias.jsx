import useFetch from "../hooks/useFetch";
import { useEffect, useState, useContext } from "react";
import RecetaCard from "./RecetaCard";
import { useAuth } from "../contexts/AuthContext";
import { RecetaContext } from "../contexts/Receta&CategoryContext";
export default function RecetasMias() {
    const { user__id } = useAuth("state");
    const [misRecetas, setMisRecetas]=useState([])
    const {recipes, isLoading, isError} = useContext(RecetaContext)

    useEffect(() => {        
        if(recipes && !isLoading){
            const misRecipes = recipes.filter((r) => r.owner === parseInt(user__id));
            setMisRecetas((prevRecipe) => [...prevRecipe, ...misRecipes]);
        }
    }, [user__id, recipes]);

    return (
        <div className="columns is-multiline recetas m-1">
            {misRecetas.length > 0 ? (
              misRecetas.map((receta) => (
                <div
                  key={receta.id}
                  className="column is-one-quarter-tablet is-two-thirds-mobile"
                >
                  <RecetaCard receta={receta} />
                </div>
              ))
            ) : <div>No hay recetas</div>
            }
        </div>
    );
}