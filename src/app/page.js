import Image from "next/image";
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-light bg-white shadow-sm px-4">
        <Link href="/" className="navbar-brand">
          <img src="/images/Logo.png" alt="Logo" height="50" />
        </Link>
        <div>
          <Link href="/login" className="btn btn-primary me-2">Iniciar Sesión</Link>
          <Link href="/register" className="btn btn-success">Registrarse</Link>
        </div>
      </nav>
      <div className="container d-flex flex-column align-items-center justify-content-center text-center flex-grow-1">
        <h1 className="display-4 fw-bold mb-4">Play with Emotions</h1>
        <p className="lead w-75">
          Una plataforma interactiva diseñada para ayudar a niños y adolescentes a reconocer y comprender emociones básicas y complejas a través de juegos educativos.
        </p>
      </div>
    </div>
  );
}
