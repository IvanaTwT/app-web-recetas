import { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export const RecetaContext = createContext();

export default function RecetaProvider({ children }) {
  const [recipes, setRecetas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cont, setCont] = useState(1);

  const [pageC, setPageC] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [isError, setIsError] = useState(false); // Estado de error

  const [{ data, isError: fetchError, isLoading: fetchLoading }, doFetch] =
    useFetch(
      `${import.meta.env.VITE_API_BASE_URL}/reciperover/recipes/?page=${cont}`,
      {}
    );

 
  const [
    { data: dataCategories, isError: isErrorCate, isLoading: isLoadingCate },
    doFetchCategories,
  ] = useFetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/reciperover/categories/?page=${pageC}`,
    {}
  );
  //recetas
  useEffect(() => {
    setIsLoading(true);
    doFetch();
  }, [cont]);

  useEffect(() => {
    if (fetchLoading) return; 
    if (fetchError) {
      setIsError(true);
      setIsLoading(false);
      return;
    }
    if (data) {
      const rta = data.results;
      setRecetas((prevRecipes) => [...prevRecipes, ...rta]);

      if (data.next) {
        setCont((cont) => cont + 1);
      } else {
        setIsLoading(false);
      }
    }
  }, [data, fetchLoading, fetchError]);

  
  //categorias
  useEffect(() => {
    doFetchCategories();
  }, [pageC]);

  useEffect(() => {
    if (dataCategories) {
      const categorias = dataCategories.results;
      // console.log(...categorias)
      setCategories((prevCat) => [...prevCat, ...categorias]);

      if (dataCategories.next) {
        setPageC((sumContador) => sumContador + 1);
      }
    }
  }, [dataCategories]);

  return (
    <RecetaContext.Provider
      value={{ recipes, isLoading, isError, categories }}
    >
      {children}
    </RecetaContext.Provider>
  );
}
