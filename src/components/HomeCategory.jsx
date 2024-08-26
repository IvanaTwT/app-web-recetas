import { useContext, useEffect, useState } from "react";
import useFetch from "./hooks/useFetch";
import { useNavigate } from "react-router-dom";
import defaultCategoryImage from "/logo.png";
import { RecetaContext } from "./contexts/Receta&CategoryContext";

export default function HomeCategory() {
    //get id y nombre, 
    const navigate = useNavigate();
    const {categories}= useContext(RecetaContext) 
   
    return (
        <>
            {categories.length > 0 ? (
                categories.map((cat,index) => (
                    <div key={index} className={`mr-3`} onClick={() => navigate(`/categories/${cat.id}`)} style={{ cursor: "pointer"}}>
                        <div className="">
                            <figure className="image is-128x128">
                                <img
                                    // className="is-rounded"
                                    style={{borderRadius:"50%"}}
                                    src={`/${cat.name.toLowerCase()}.jpg`}
                                    alt=""
                                    onError={(e) => {
                                        e.target.src = defaultCategoryImage;
                                    }}
                                />
                            </figure>
                        </div>
                        <div className=" has-text-centered">
                            <h3 className="has-text-dark">{cat.name.toUpperCase()}</h3>
                        </div>
                    </div>
                ))
            ): <div></div>}
        </>
    );
}
