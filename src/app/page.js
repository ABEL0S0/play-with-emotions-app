'use client';
import Image from "next/image";
import Link from "next/link";
import { Menubar } from "primereact/menubar"; // Importamos el componente Menubar de PrimeReact
import { Button } from "primereact/button";
import "bootstrap/dist/css/bootstrap.min.css"; // Si necesitas estilos adicionales de Bootstrap

export default function Home() {

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Menubar de PrimeReact */}
      <Menubar
        className="p-shadow-2 p-p-4"
        start={
          <Link legacyBehavior href="/">
            <a className="navbar-brand">
              <Image src="/images/Logo.png" alt="Logo" height={250} width={250} />
            </a>
          </Link>
        }
        end={
          <div className="p-d-flex">
            <Link legacyBehavior href="/login">
              <a>
                <Button className="p-button p-button-text p-button-primary">Iniciar Sesión </Button>
              </a>
            </Link>
            <a>     </a>
            <Link legacyBehavior href="/register">
              <a>
                <Button className="p-button p-button-text p-button-success"> Registrarse</Button>
              </a>
            </Link>
          </div>
        }
      />

      {/* Contenido principal */}
      <div className="container d-flex flex-column align-items-center justify-content-center text-center flex-grow-1">
        <h1 className="display-4 fw-bold mb-4">Play with Emotions</h1>
        <p className="lead w-75">
          Una plataforma interactiva diseñada para ayudar a niños y adolescentes a reconocer y comprender emociones básicas y complejas a través de juegos educativos.
        </p>
      </div>
    </div>
  );
}


