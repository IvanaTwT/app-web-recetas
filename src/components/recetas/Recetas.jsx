import useFetch from "../hooks/useFetch";
import { useEffect, useState,useContext } from "react";
import RecetaCard from "./RecetaCard";
import { RecetaContext } from "../contexts/Receta&CategoryContext";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";

export default function Recetas({ algunas = false }) {
  const { id } = useParams(); // id de categoria  
  const {recipes, isLoading, isError,categories} = useContext(RecetaContext)

  const [recetasByCate, setRecetasByCate] = useState([]);
  const path = window.location.pathname; //ruta
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id && recipes && path !== "/recetas" && !isLoading) {
      //hacer un filtrado para agregar solo las recetas que tengan esa categoria
      const recipeByCategory = recipes.filter((recipe) =>
        recipe.categories.includes(parseInt(id))
      );
      setRecetasByCate(recipeByCategory);
    }
  }, [id, recipes, isLoading]);

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar las recetas.</p>;
  if (!recipes) return <p>No hay recetas disponibles</p>;

  return (
    // is-full m-1  >
    <div className="columns m-1">
      <div className="column is-3"
      style={{background: "#8bc34a", 
      background: "-webkit-linear-gradient(to right, #56ab2f, #a8e063)",
      background: "linear-gradient(to right, #56ab2f, #a8e063)"}}>
        <div className=" m-1">
          <ul className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
            <li
              className="is-size-4 p-1 label"
              style={{ border: "1px solid #000" }}
            >
              <span>CATEGORIAS</span>
            </li>

            {categories.length > 0 && recipes ? (
              categories.map((cat) => (
                <li
                  key={cat.id}
                  className="has-text-dark category-item"
                  onClick={() => {
                    navigate(`/categories/${cat.id}`);
                  }}
                >
                  {cat.name.toUpperCase()}
                </li>
              ))
            ) : (
              <li>No hay categorias</li>
            )}
          </ul>
        </div>
      </div>
      <div className="column is-9">
        <div
          className="columns is-multiline recetas m-1"
          style={{ overflow: "auto", width: "100% ", height: "600px" }}
        >
          {path === "/recetas" ? (
            // Caso para cuando la ruta es "/recetas"
            recipes && recipes.length > 0 ? (
              recipes.map((receta) => (
                <div
                  key={receta.id}
                  className="column is-one-quarter-tablet is-two-thirds-mobile"
                >
                  <RecetaCard receta={receta} />
                </div>
              ))
            ) : (
              <div>No hay recetas</div>
            )
          ) : // Caso para cuando la ruta no es "/recetas"
          recetasByCate.length > 0 ? (
            recetasByCate.map((receta) => (
              <div
                key={receta.id}
                className="column is-one-quarter-tablet is-two-thirds-mobile"
              >
                <RecetaCard receta={receta} />
              </div>
            ))
          ) : (
            <div>No hay recetas para esta categoria</div>
          )}
        </div>
      </div>
    </div>
  );
}
