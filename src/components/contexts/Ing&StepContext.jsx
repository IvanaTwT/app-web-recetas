import { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export const IngredientesContext = createContext();

export default function IngredientProvider({ children }) {
    const [ingredientesContexto, setIngredientesContexto] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoadingIngrediente, setIsLoadingIngrediente] = useState(true);
    const [isErrorIngrediente, setIsErrorIngrediente] = useState(false);
    const [pasos, setPasos] = useState([]);
    const [cont, setCont] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [
        { data: dataIng, isError: isErrorIng, isLoading: isLoadingIng },
        doFetchIng,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/ingredients/?page=${page}`,
        {}
    );

    const [
        { data: dataStep, isError: isErrorStep, isLoading: isLoadingStep },
        doFetchStep,
    ] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/reciperover/steps/?page=${cont}`,
        {}
    );

    useEffect(() => {
        setIsLoading(true);
        doFetchStep();
    }, [cont]);

    useEffect(() => {
        if (dataStep) {
            const rta = dataStep.results;
            // console.log('Data Step:', dataStep.results)
            setPasos((prevPasos) => [...prevPasos, ...rta]);

            if (dataStep.next) {
                setCont((prevCont) => prevCont + 1);
            } else {
                setIsLoading(false);
            }
        } else if (isErrorStep) {
            setIsLoading(false);
            setIsError(true);
        }
    }, [dataStep, isErrorStep]);

    useEffect(() => {
        setIsLoadingIngrediente(true);
        doFetchIng();
    }, [page]);

    useEffect(() => {
        if (dataIng) {
            const ingredients = dataIng.results;
            setIngredientesContexto((prev) => [...prev, ...ingredients]);

            if (dataIng.next) {
                setPage((prevPage) => prevPage + 1);
            } else {
                setIsLoadingIngrediente(false);
            }
        } else if (isErrorIng) {
            setIsLoadingIngrediente(false);
            setIsErrorIngrediente(true);
        }
    }, [dataIng, isErrorIng]);

    return (
        <IngredientesContext.Provider value={{
            ingredientesContexto,
            isLoadingIngrediente,
            isErrorIngrediente,
            pasos,
            isLoading,
            isError
        }}>
            {children}
        </IngredientesContext.Provider>
    );
}
