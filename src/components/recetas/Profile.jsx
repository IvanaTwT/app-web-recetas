import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProfileImageModal from "./ProfileImageModal";
import defaultUserImage from "./logo-user.png";
import { formatDateTime } from "../hooks/utils";
import Swal from "sweetalert2";
import useFetch from "../hooks/useFetch";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [profileImageData, setProfileImageData] = useState(null);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [isLoadingUserStates, setLoadingUserStates] = useState(null);
    const [userStates, setUserStates] = useState(null);
    const [errorUpdating, setErrorUpdating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingState, setIsEditingState] = useState(false);

    const { token } = useAuth("state");

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const dobRef = useRef(null);
    const bioRef = useRef(null);
    const userStateRef = useRef(null);

    const doFetch = async () => {
        setLoadingUpdate(true);
        fetch(
            `${import.meta.env.VITE_API_BASE_URL}/users/profiles/${
                userData.user__id
            }/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    first_name: firstNameRef.current.value,
                    last_name: lastNameRef.current.value,
                    email: emailRef.current.value,
                    dob: dobRef.current.value,
                    bio: bioRef.current.value,
                }),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("No se pudo actualizar el usuario");
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    setUserData(data);
                }
            })
            .catch(() => {
                setErrorUpdating(true);
                Swal.fire({
                    title: "Error!",
                    text: "Ocurrió un error al actualizar el perfil.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            })
            .finally(() => {
                setLoadingUpdate(false);
            });
    };

    const fetchUserStates = async () => {
        setLoadingUserStates(true);
        fetch(`${import.meta.env.VITE_API_BASE_URL}/users/user-states/`, {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("No se pudo actualizar el usuario");
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    setUserStates(data);
                }
            })
            .catch(() => {})
            .finally(() => {});
    };

    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_API_BASE_URL}/users/profiles/profile_data/`,
            {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                return response.json();
            })
            .then((data) => {
                setUserData(data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchUserStates();
    }, [isEditingState]);

    function handleEditMode() {
        setEditMode(!editMode);
    }

    function handleSubmit(event) {
        event.preventDefault();
        doFetch();
    }

    function handleStateChange(event) {
        const newUserStateID = event.target.value;

        fetch(
            `${import.meta.env.VITE_API_BASE_URL}/users/profiles/${
                userData.user__id
            }/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    state: newUserStateID,
                }),
            }
        );
    }

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="section">
            <div className="columns is-centered">
                <div className="column is-8">
                    <div className="card">
                        {userData ? (
                            <>
                                <div className="card-content">
                                    <form
                                        className="card-content"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="media">
                                            <div className="media-left">
                                                <figure className="image is-128x128">
                                                    <img
                                                        src={
                                                            userData.image
                                                                ? `${
                                                                      import.meta
                                                                          .env
                                                                          .VITE_API_BASE_URL
                                                                  }${
                                                                      userData.image
                                                                  }`
                                                                : defaultUserImage
                                                        }
                                                        alt="Profile image"
                                                        style={{
                                                            borderRadius: "50%",
                                                        }}
                                                        onClick={() =>
                                                            setIsModalOpen(true)
                                                        }
                                                    />
                                                </figure>
                                            </div>
                                            <div className="media-content">
                                                {editMode ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "0.5rem",
                                                            alignItems:
                                                                "center",
                                                            marginBottom:
                                                                "0.5rem",
                                                        }}
                                                    >
                                                        <input
                                                            type="text"
                                                            className="input is-small"
                                                            ref={firstNameRef}
                                                            defaultValue={
                                                                userData.first_name
                                                            }
                                                            style={{
                                                                width: "40%",
                                                            }}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="input is-small"
                                                            ref={lastNameRef}
                                                            defaultValue={
                                                                userData.last_name
                                                            }
                                                            style={{
                                                                width: "40%",
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="title is-3 pb-2">
                                                            {firstNameRef
                                                                .current
                                                                ?.value ||
                                                                userData.first_name}{" "}
                                                            {lastNameRef.current
                                                                ?.value ||
                                                                userData.last_name}
                                                        </p>
                                                        <p className="subtitle is-5">
                                                            @{userData.username}
                                                        </p>
                                                    </div>
                                                )}

                                                { editMode ? (
                                                    <div className="field">
                                                        <div className="control">
                                                            <div className="select is-small">
                                                                <select
                                                                    ref={
                                                                        userStateRef
                                                                    }
                                                                    defaultValue={
                                                                        userData.state.id
                                                                    }
                                                                    onChange={
                                                                        handleStateChange
                                                                    }
                                                                >
                                                                    {userStates &&
                                                                        userStates.results.map(
                                                                            (
                                                                                state
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        state.id
                                                                                    }
                                                                                    value={
                                                                                        state.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        state.name
                                                                                    }
                                                                                </option>
                                                                            )
                                                                        )}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="subtitle is-6"
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            marginTop: "10px",
                                                        }}
                                                    >
                                                        <img
                                                            src={`${
                                                                import.meta.env
                                                                    .VITE_API_BASE_URL
                                                            }${
                                                                userData.state ? userData.state.icon : ""
                                                            }`}
                                                            alt="State icon"
                                                            style={{
                                                                height: "20px",
                                                                marginRight:
                                                                    "5px",
                                                                borderRadius:
                                                                    "50%",
                                                            }}
                                                        />
                                                        { userData.state ? userData.state.name : "No especificado"}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className="button is-primary"
                                                onClick={handleEditMode}
                                            >
                                                {!editMode ? "Editar" : "Salir"}
                                            </button>
                                        </div>

                                        <div className="content">
                                            <div className="field">
                                                <label className="label">
                                                    Email:
                                                </label>
                                                <div className="control">
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        id="email"
                                                        name="email"
                                                        ref={emailRef}
                                                        defaultValue={
                                                            userData.email
                                                        }
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label className="label">
                                                    Fecha de Nacimiento:
                                                </label>
                                                <div className="control">
                                                    <input
                                                        type="date"
                                                        className="input"
                                                        id="dob"
                                                        name="dob"
                                                        ref={dobRef}
                                                        defaultValue={
                                                            userData.dob || ""
                                                        }
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label className="label">
                                                    Biografía:
                                                </label>
                                                <div className="control">
                                                    <textarea
                                                        className="textarea"
                                                        id="bio"
                                                        name="bio"
                                                        ref={bioRef}
                                                        defaultValue={
                                                            userData.bio ||
                                                            "No especificado"
                                                        }
                                                        disabled={!editMode}
                                                    />
                                                </div>
                                            </div>

                                            {editMode ? (
                                                <div className="field">
                                                    <button
                                                        className="button is-primary is-fullwidth"
                                                        type="submit"
                                                    >
                                                        {loadingUpdate
                                                            ? "Enviando..."
                                                            : "Enviar"}
                                                        {errorUpdating
                                                            ? "Ocurrió un error al enviar el formulario"
                                                            : null}
                                                    </button>
                                                </div>
                                            ) : null}

                                            <hr />
                                            <span className="is-italic is-size-7">
                                                Creado:{" "}
                                                {formatDateTime(
                                                    userData.created_at
                                                )}
                                            </span>
                                            <br />
                                            <span className="is-italic is-size-7">
                                                Actualizado:{" "}
                                                {formatDateTime(
                                                    userData.updated_at
                                                )}
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <p className="subtitle">
                                No se encontraron datos del usuario.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;
