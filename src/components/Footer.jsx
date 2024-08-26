import "/src/assets/css/style.css";

export default function Footer() {
    return (
        // style={{magin:"0", padding:"0"}}
        <footer className="footer custom" >
            <div className="content has-text-centered" >
                <p className="has-text-black">
                    Tus recetas by{" "}
                    <a href="https://gmail.com">tusRecetas@gmail.com</a>.
                </p>
            </div>
        </footer>
    );
}