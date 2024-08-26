import { useContext, useEffect, useState } from "react";
import { IngredientesContext }  from "../contexts/Ing&StepContext";
export default function RecetaPasos({ receta }) {
    const [steps, setSteps] = useState([]);
    const { pasos, isLoading, isError } = useContext(IngredientesContext);
    const [pasosDesordenados, setPasosDesordenados] = useState([]);

    useEffect(() => {
        if (pasos && receta.id) {
            // console.log('Pasos desde contexto:', pasos); // Verifica los pasos desde el contexto
            const stepOfRecipe = pasos.filter((step) => step.recipe === receta.id);
            setPasosDesordenados(stepOfRecipe);
        }
    }, [pasos, receta.id, receta]);

    useEffect(() => {
        if (pasosDesordenados && receta.id ) {
            const pasosOrdenados = pasosDesordenados.sort((a, b) => a.order - b.order);
            setSteps(pasosOrdenados);
        }
    }, [pasosDesordenados, receta.id, receta]);

    if (isLoading) return <p>Cargando pasos...</p>;
    if (isError) return <p>Error al cargar los pasos.</p>;

    return (
        <div className="column" style={{ margin: "1em" }}>
            <h3 className="title is-5">Preparación:</h3>
            <div className="steps">
                {steps.length > 0 ? (
                    <ol>
                        {steps.map((paso) => (
                            <li key={paso.id} className="m-1">{paso.instruction}</li>
                        ))}
                    </ol>
                ) : (
                    <p>No hay pasos disponibles para esta receta</p>
                )}
            </div>
        </div>
    );
}
