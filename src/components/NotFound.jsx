
export default function NotFound(){
    return (
        <div className="hero is-fullheight has-dark">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="title is-1">¡Oops!</h1>
                    <p className="subtitle is-3">No hemos encontrado lo que estás buscando.</p>
                    {/* <div className="box">
                        <figure className="image is-128x128">
                            <img src="" alt="error 404"/>
                        </figure>
                    </div> */}
                    <button className="button is-danger is-large" onClick={() => window.location.href = '/'}>
                        Volver a la página principal
                    </button>
                </div>
            </div>
        </div>
    );
};