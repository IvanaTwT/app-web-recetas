import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { formatDateTime } from "../hooks/utils";
import { useAuth } from "../contexts/AuthContext";
import defaultUserImage from "./logo-user.png";
import { useParams } from "react-router-dom";
import "./style.css";

export default function Users() {
    const { id } = useParams();

    const { isAuthenticated, token } = useAuth("state");
    const [user, setUser] = useState(null);

    const [{ data, isError, isLoading }, doFetch] = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/profiles/${id}/`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        }
    );

    useEffect(() => {
        if (isAuthenticated) {
            doFetch();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [data]);

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar la información del usuario.</p>;

    return (
        <section className="section">
            <div className="columns is-centered">
                <div className="column is-8">
                    <div className="card">
                        <div className="card-content">
                            {user ? (
                                <div>
                                    <div className="media">
                                        <div className="media-left">
                                            <figure className="image is-128x128 profile-image">
                                                <img
                                                    src={
                                                        user.image
                                                            ? `${import.meta.env.VITE_API_BASE_URL}${user.image}`
                                                            : defaultUserImage
                                                    }
                                                    alt={`${user.first_name} ${user.last_name}`}
                                                    style={{
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                            </figure>
                                        </div>
                                        <div className="media-content">
                                            <h1 className="title is-3">
                                                {user.first_name}{" "}
                                                {user.last_name}
                                            </h1>
                                            <p className="subtitle is-5">
                                                @
                                                {user.username ||
                                                    "No especificado"}
                                            </p>
                                            <p className="subtitle is-5">
                                                Estado: 
                                                { user.state ? user.state.name :
                                                    "No especificado"}
                                            </p>
                                        </div>
                                    </div>
                                    <p>
                                        <strong>Email:</strong>{" "} {user.email}
                                    </p>
                                    <p>
                                        <strong>Fecha de Nacimiento:</strong>{" "} {user.dob || "No especificado"}
                                    </p>
                                    <p>
                                        <strong>Biografía: </strong>{" "}
                                        {user.bio || "No especificado"}
                                    </p>
                                    <hr />
                                    <span className="is-italic is-size-7">
                                        Creado:{" "}
                                        {formatDateTime(user.created_at)}
                                    </span>
                                    <br />
                                    <span className="is-italic is-size-7">
                                        Actualizado:{" "}
                                        {formatDateTime(user.updated_at)}
                                    </span>
                                </div>
                            ) : (
                                <div>Cargando perfil...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}