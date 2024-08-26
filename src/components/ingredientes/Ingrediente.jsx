import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Ingrediente({
  addIngrediente,
  editIngredientInitial,
  paginaEdit,
  deleteIngredients,
}) {
  const { id } = useParams();
  const [ingSubmit, setIngSubmit] = useState([]);
  const [ingrediente, setIngrediente] = useState({
    name: "",
    quantity: null,
    measure: "",
  });
  // ediciones para los ingredientes anteriores
  const [listIng, setListIng] = useState([]);
  const [ingredientsEdit, setIngredientsEdit] = useState([]);
  const [editSuccess, setEditSuccess] = useState(null);

  const [formIngredient, setFormIngredient] = useState(false);

  const medidas = [
    "g",
    "kg",
    "lbs",
    "oz",
    "ml",
    "l",
    "cup",
    "tbsp",
    "tsp",
    "u",
    "pcs",
    "pkgs",
    "pinch",
    "bunch",
  ];

  useEffect(() => {
    if (paginaEdit) {
      // Función asincrónica para obtener los ingredientes
      async function fetchIngredients() {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/reciperover/recipes/${id}/ingredients/`
          );

          if (!response.ok) {
            throw new Error("No se pudieron cargar los ingredientes");
          }
          const data = await response.json();
          // Obtener todos los detalles de los ingredientes en paralelo
          const ingredientPromises = data.results.map(async (ingR) => {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/reciperover/ingredients/${
                ingR.ingredient
              }/`
            );
            if (!response.ok) {
              throw new Error("No se pudo traer el ingrediente");
            }
            const ing = await response.json();
            return {
              id: ingR.id,
              ingredient: ing.id,
              name: ing.name,
              quantity: ingR.quantity,
              measure: ingR.measure,
            };
          });
          // Esperar a que todas las promesas se resuelvan
          const ingredientsList = await Promise.all(ingredientPromises);
          setListIng(ingredientsList); //agregar los ingredientes a la lista
        } catch (error) {
          console.error("Error al realizar la petición", error);
        }
      }

      fetchIngredients();
    }
  }, [id, paginaEdit]);

  function handleClick() {
    setFormIngredient(!formIngredient);
  }

  function handleIngredientChange(event) {
    setIngrediente({
      ...ingrediente,
      [event.target.name]: event.target.value,
    });
  }

  // function para los elementos a cargar o asignar
  function handleSubmitIng(event) {
    // event.stopPropagation();
    event.preventDefault();
    if (ingrediente.name && ingrediente.quantity && ingrediente.measure) {
      addIngrediente(ingrediente); // llamada desde RecetaForm
      setIngSubmit([...ingSubmit, ingrediente]);
      setIngrediente({ name: "", quantity: "", measure: "" });
      setFormIngredient(false);
    } else {
      // Opcional: mostrar un mensaje de error si los campos no están completos
      alert("Por favor complete todos los campos.");
    }
  }
  // funcion para los ingredientes anteriores
  function handleIngEditChange(event) {
    setIngredientsEdit({
      ...ingredientsEdit,
      [event.target.name]: event.target.value,
    });
  }
  function handleOnClickDelete(idEliminado) {
    //
    // console.log("id ing: (I): "+idEliminado)
    const listaUpdate = listIng.filter(
      (ing) => ing.id !== parseInt(idEliminado)
    );
    // console.log(listaUpdate)
    setListIng(listaUpdate); //actualizando lista de ingredientes
    deleteIngredients(idEliminado); //mandamos el id a RecetaForm
  }
  function handleOnClickEditIng(id, event) {
    // para modicar un ingrediente debo de tener el nombre del ingrediente, y en la tabla intermedia el id
    const [lista] = listIng.filter((ing) => ing.id === id);
    // console.log(listIng)// all ingredientes
    //console.log(lista); //ingrediente inicial
    //console.log(ingredientsEdit); //campo modificado
    editIngredientInitial([lista, ingredientsEdit]);
    setEditSuccess(id);
  }

  return (
    <div className="">
      <div className="is-flex is-flex-direction-row is-justify-content-space-between">
        <label className="label has-text-white">Ingredientes</label>
        <p
          className="button custom "
          style={{ width: "40px", heigth: "30px" }}
          onClick={handleClick}
        >
          +
        </p>
      </div>
      {paginaEdit ? (
        <div className="container-ingredientes">
          {listIng.length > 0
            ? listIng.map((ing, index) => (
                <div key={ing.id} className="is-flex is-flex-direction-row m-1">
                  <input
                    className="input mr-1"
                    type="text"
                    name="name"
                    defaultValue={ing.name}
                    onChange={handleIngEditChange}
                    required
                  />
                  <input
                    className="input mr-1"
                    type="number"
                    name="quantity"
                    defaultValue={ing.quantity}
                    onChange={handleIngEditChange}
                    required
                  />
                  {/* <div className="select mr-1">
                            <select
                                name="measure"
                                defaultValue={ingrediente.measure}
                                onChange={handleIngredientChange}
                            >
                                <option value="">Seleccione una medida</option> */}
                  <div className="select mr-1">
                    <select
                      className=""
                      name="measure"
                      defaultValue={ing.measure}
                      onChange={handleIngEditChange}
                    >
                      <option value="">Seleccione una medida</option>
                      {medidas.map((m, index) => (
                        <option key={index} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p
                    onClick={() => handleOnClickEditIng(ing.id)}
                    className={`button mr-1  ${
                      editSuccess === ing.id ? "custom" : "is-info"
                    }`}
                  >
                    {editSuccess === ing.id ? (
                      <ion-icon name="checkmark-circle-outline"></ion-icon>
                    ) : (
                      <ion-icon name="create-outline"></ion-icon>
                    )}
                  </p>

                  <p
                    onClick={() => handleOnClickDelete(ing.id)}
                    className="button is-danger"
                  >
                    <ion-icon name="trash-outline"></ion-icon>
                  </p>
                </div>
              ))
            : null}
        </div>
      ) : null}
      <div>
        <h3 style={{ color: "#49ff4f" }}>Agregados: </h3>
        {ingSubmit.length > 0
          ? ingSubmit.map((i, index) => (
              <div key={index} className="is-flex is-flex-direction-row m-1">
                <input
                  className="input mr-1"
                  type="text"
                  defaultValue={i.name}
                  readOnly
                />
                <input
                  className="input mr-1"
                  type="numer"
                  defaultValue={i.quantity}
                  readOnly
                />
                <input
                  className="input"
                  type="text"
                  defaultValue={i.measure}
                  readOnly
                />
              </div>
            ))
          : null}
      </div>
      {formIngredient ? (
        <div className="form-ingredient">
          <div className="is-flex is-flex-direction-row m-1">
            <input
              className="input mr-1"
              type="text"
              name="name"
              defaultValue={ingrediente.name}
              onChange={handleIngredientChange}
              placeholder="Nombre"
            />
            <input
              className="input mr-1"
              type="number"
              min="1"
              name="quantity"
              defaultValue={ingrediente.quantity}
              onChange={handleIngredientChange}
              placeholder="Cantidad"
            />
            <div className="select mr-1">
              <select
                name="measure"
                defaultValue={ingrediente.measure}
                onChange={handleIngredientChange}
              >
                <option value="">Seleccione una medida</option>
                {medidas.map((m, index) => (
                  <option key={index} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="button custom"
              onClick={handleSubmitIng}
            >
              Agregar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
